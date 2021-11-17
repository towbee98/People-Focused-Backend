const { promisify } = require("util");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appErrors");
const Email = require("../utils/email");

// This function generates a token for a logged in user
const signToken = (id) =>
  jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: "4h",
  });

const SendToken = async (user, statusCode, res) => {
  const token = await signToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 4 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  console.log(res.cookie("jwt", token, cookieOptions));

  if (statusCode === 201) {
    // for sign up
    res.status(statusCode).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
  } else {
    // for login
    res.status(statusCode).json({
      status: "success",
      token,
    });
  }
};

exports.signUp = catchAsync(async (req, res) => {
  const newUser = await User.create({
    firstname: req.body.firstname,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });
  url=0;
  newUser.password = undefined;
  await new Email(newUser,url).sendWelcome();
  SendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // Check if user entered an email and password
  if (!email || !password) {
    return next(
      new AppError("Please enter a valid email and password", 400)
    );
  }
  // Check if the email exists
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.checkPassword(user.password, password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  SendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // Check if the token exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in , Please log in to proceed", 401)
    );
  }

  // Verify the token
  const verifiedToken = await promisify(jwt.verify)(
    token,
    process.env.SECRET_KEY
  );

  // Check if the user still exists
  const validUser = await User.findById(verifiedToken.id);

  if (!validUser) {
    return next(
      new AppError("The user belonging to this token no longer exists", 401)
    );
  }

  // Check if the password was changed after token was issued
  const checkTokenValidity = validUser.changedPasswordAfter(
    verifiedToken.iat
  );

  if (checkTokenValidity) {
    return next(
      new AppError(
        "Password was changed recently , Please login again",
        401
      )
    );
  }

  // Grant access to the protected route
  req.user = validUser;
  next();
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    // Verify the token
    const verifiedToken = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.SECRET_KEY
    );

    // Check if the user still exists
    const validUser = await User.findById(verifiedToken.id);

    if (!validUser) {
      res.status(401).redirect('/login');
    }

    // Check if the password was changed after token was issued
    const checkTokenValidity = validUser.changedPasswordAfter(
      verifiedToken.iat
    );

    if (checkTokenValidity) {
      res.status(401).redirect('/login')
    }

    // Grant access to the protected route
    res.locals.user = validUser;
    return next();
  }
  res.status(401).redirect("/login")
});

exports.restrictUserTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("Sorry you are not allowed to access this route", 403)
      );
    }
    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  // Check if the email exists on the database
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("Oops, Email does not exist.", 404));
  }
  // Generate a random token
  const resetToken = await user.createPasswordResetToken();
  // console.log(resetToken);
  await user.save({ validateBeforeSave: false });
  // Send token to the user email
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Hello ${user.email} \n
   Someone has requested a link to change your password.
   You can do this by submitting a patch request with your new password and passwordConfirm to the link below.\n
   ${resetUrl}.\n If you did not forget your password , please ignore this email`;

  const subject = `Reset Password Instruction for your PeopleFocused Account(Valid for 10 mins)`;

  // Send the mail containing the password reset token  to the user specified email
  try {
    // await sendEmail({
    //   email: user.email,
    //   message: message,
    //   subject: subject,
    // });

    res.status(200).json({
      status: "success",
      message: "Password Reset token sent to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError("Error while trying to send the email, Try again", 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1.) Get the user based on token
  const hashedToken = await crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2.) check if the user exists and if token is valid before assigning the new password
  if (!user) {
    return next(
      new AppError("Sorry User not found or Token has expired ", 404)
    );
  }
  // Update password ,passwordConfirm and passwordResetToken and passwordResetExpires
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3.)Update the passwordChangedAt property

  // 4.) Log the user in ,send the JWT
  SendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // get the user from the database
  const user = await User.findById(req.user._id).select("+password");
  if (!user) return next(new AppError("User not found", 404));
  // check if posted current password is correct
  const validPassword = await user.checkPassword(
    user.password,
    req.body.oldPassword
  );
  if (!validPassword) return next(new AppError("Unauthorized ", 403));
  // Update the password
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConfirm;
  await user.save();
  // Log the user in again
  SendToken(user, 200, res);
});
