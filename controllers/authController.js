const { promisify } = require("util");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appErrors");
const sendEmail = require("./../utils/email");

//This function generates a token for a logged in user
const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: "4h",
  });
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
  const token = await signToken(newUser._id);
  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //Check if user entered an email and password
  if (!email || !password) {
    return next(new AppError("Please enter a valid email and password", 400));
  }
  //Check if the email exists
  const user = await User.findOne({ email }).select("+password");
  //console.log(user);
  if (!user || !user.checkPassword(password, user.password)) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const token = await signToken(user._id);
  //send token to client if no error
  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //Check if the token exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in , Please log in to proceed", 401)
    );
  }

  //Verify the token
  const verifiedToken = await promisify(jwt.verify)(token, process.env.SECRET_KEY);

  //Check if the user still exists
  const validUser = await User.findById(verifiedToken.id);

  if (!validUser) {
    return next(
      new AppError("The user belonging to this token no longer exists", 401)
    );
  }

  //Check if the password was changed after token was issued
  const checkTokenValidity = validUser.changedPasswordAfter(verifiedToken.iat);

  if (checkTokenValidity) {
    return next(
      new AppError("Password was changed recently , Please login again", 401)
    );
  }

  //Grant access to the protected route
  req.user = validUser;
  next();
});

exports.restrictUserTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("Sorry you are not allowed to access this route", 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  //Check if the email exists on the database
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("Oops, Email does not exist.", 404));
  }
  //Generate a random token
  const resetToken = await user.createPasswordResetToken();
  console.log(resetToken);
  await user.save({ validateBeforeSave: false });
  //Send to the user email

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Hello ${user.email} \n
   Someone has requested a link to change your password.
   You can do this by submitting a patch request with your new password and passwordConfirm to the link below.\n
   ${resetUrl}.\n If you did not forget your password , please ignore this email`;

  const subject = `Reset Password Instruction for your PeopleFocused Account(Valid for 10 mins)`;

  try {
    await sendEmail({
      email: user.email,
      message: message,
      subject: subject,
    });

    res.status(200).json({
      status: "success",
      message: "Password Reset token sent to email",
    });
  } catch (err) {
    console.log(err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError("Error while trying to send the email, Try again", 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1.) Get the user based on token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  //2.) check if the user exists and if token is valid before assigning the new password
  if (!user) {
    return next(new AppError("Sorry User not found ", 404));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //3.)Update the passwordChangedAt property

  //4.) Log the user in ,send the JWT
  const token = await signToken(user._id);
  //send token to client if no error
  res.status(200).json({
    status: "success",
    token,
  });
});
