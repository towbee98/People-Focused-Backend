/* eslint-disable arrow-body-style */
const { promisify } = require("util");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appErrors");
const APIFEATURES = require("../utils/apiFeatures");
const Email = require("../utils/email");

//Send token for logged in users
SendToken = async (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
    expiresIn: "4h"
  });
  const cookieOptions = {
    expires: new Date(Date.now() + 4 * 60 * 60 * 1000),
    httpOnly: true
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);
  res.status(statusCode).json({
    status: "success",
    token
  });
};

exports.getAll = (Model) => {
  return catchAsync(async (req, res, next) => {
    // console.log(req.query)
    // Execute the query
    const features = new APIFEATURES(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const docs = await features.query;
    res.status(200).json({
      status: "success",
      requestMadeAt: req.requestTime,
      result: docs.length,
      data: docs
    });
  });
};

exports.getOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.jobID);
    if (!doc) {
      return next(new AppError("Not Found", 404));
    }
    res.status(200).json({
      status: "success",
      requestMadeAt: req.requestTime,
      data: {
        doc
      }
    });
  });
};

exports.login = (Model) => {
  return catchAsync(async (req, res, next) => {
    try {
      const { email, password } = req.body;
      // Check if user entered an email and password
      if (!email || !password) {
        return next(
          new AppError("Please enter a valid email and password", 400)
        );
      }
      // Check if the email exists
      const result = await Model.findOne({ email }).select("+password");

      if (!result || !(await result.checkPassword(result.password, password))) {
        return next(new AppError("Incorrect email or password", 401));
      }
      if (result.status && result.status != "Active") {
        return next(
          new AppError("Pending account .Please verify your email", 401)
        );
      }
      await SendToken(result, 200, res);
    } catch (err) {
      console.log(err);
    }
  });
};

exports.forgetPassword = (Model) => {
  return catchAsync(async (req, res, next) => {
    const email = req.body.email;
    // Check if the email exists on the database
    const entity = await Model.findOne({ email });
    if (!entity) {
      return next(new AppError("Oops, Email does not exist.", 404));
    }
    // Generate a random token
    const resetToken = await entity.createPasswordResetToken();
    // console.log(resetToken);
    await entity.save({ validateBeforeSave: false });
    // Send token to the user email
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/resetPassword/${resetToken}`;

    try {
      await new Email(entity, resetUrl).forgetPassword();

      res.status(200).json({
        status: "success",
        message: "Password Reset token sent to email"
      });
    } catch (err) {
      entity.passwordResetToken = undefined;
      entity.passwordResetExpires = undefined;
      await entity.save({ validateBeforeSave: false });
      return next(
        new AppError("Error while trying to send the email, Try again", 500)
      );
    }
  });
};

exports.resetPassword = (Model) => {
  return catchAsync(async (req, res, next) => {
    // 1.) Get the user based on token
    const hashedToken = await crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const entity = await Model.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });
    // 2.) check if the user exists and if token is valid before assigning the new password
    if (!entity) {
      return next(
        new AppError("Sorry User not found or Token has expired ", 404)
      );
    }
    // Update password ,passwordConfirm and passwordResetToken and passwordResetExpires
    entity.password = req.body.password;
    entity.passwordConfirm = req.body.passwordConfirm;
    entity.passwordResetToken = undefined;
    entity.passwordResetExpires = undefined;
    await entity.save();

    // 3.)Update the passwordChangedAt property

    // 4.) Ask the user to login again with the new password
    res.status(200).json({
      status: "success",
      message:
        "Password changed successfully, Login with the new password credentials"
    });
    // // 4.) Log the user in ,send the JWT
    // SendToken(user, 200, res);
  });
};

exports.updatePassword = (Model) => {
  return catchAsync(async (req, res, next) => {
    // get the user from the database
    const user = await Model.findById(req.user._id).select("+password");
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
};

exports.verifyAccount = (Model) => {
  return catchAsync(async (req, res, next) => {
    //find the user and activate the account .
    const user = await Model.findOneAndUpdate(
      { confirmationCode: req.params.confirmCode },
      { status: "Active" },
      {
        new: true,
        runValidators: true
      }
    );
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    next();
  });
};

exports.protect = (Model) => {
  return catchAsync(async (req, res, next) => {
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
    const validUser = await Model.findById(verifiedToken.id);

    if (!validUser) {
      return next(
        new AppError(
          "User not found or you are not allowed to access this route",
          401
        )
      );
    }

    // Check if the password was changed after token was issued
    const checkTokenValidity = validUser.changedPasswordAfter(
      verifiedToken.iat
    );

    if (checkTokenValidity) {
      return next(
        new AppError("Password was changed recently , Please login again", 401)
      );
    }

    // Grant access to the protected route
    req.user = validUser;
    next();
  });
};

exports.isLoggedIn = (Model) => {
  return catchAsync(async (req, res, next) => {
    if (req.cookies.jwt) {
      // Verify the token
      const verifiedToken = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.SECRET_KEY
      );

      // Check if the user still exists
      const validUser = await Model.findById(verifiedToken.id);

      if (!validUser) {
        res.status(401).redirect("/login");
      }

      // Check if the password was changed after token was issued
      const checkTokenValidity = validUser.changedPasswordAfter(
        verifiedToken.iat
      );
      if (checkTokenValidity) {
        res.status(401).redirect("/login");
      }

      // Grant access to the protected route
      res.locals.user = validUser;
      return next();
    }
    res.status(401).redirect("/login");
  });
};
