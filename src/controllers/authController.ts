const jwt = require("jsonwebtoken");
const User = require("../src/models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appErrors");
const Email = require("../utils/email");
const handlerFactory = require("./handlerFactory");

exports.login = handlerFactory.login(User);
exports.protect = handlerFactory.protect(User);
exports.isLoggedIn = handlerFactory.isLoggedIn(User);
exports.forgetPassword = handlerFactory.forgetPassword(User);
exports.resetPassword = handlerFactory.resetPassword(User);
exports.updatePassword = handlerFactory.updatePassword(User);
exports.verifyUser = handlerFactory.verifyAccount(User);

exports.signUp = catchAsync(async (req, res, next) => {
  const confirmCode = jwt.sign(
    { email: req.body.email },
    process.env.SECRET_KEY
  );
  const newUser = await User.create({
    firstname: req.body.firstname,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    confirmationCode: confirmCode,
    role: req.body.role
  });
  url = `${req.protocol}://${req.get("host")}/users/confirm/${confirmCode}`;
  newUser.password = undefined;
  newUser.confirmationCode = undefined;
  //Send confirmation to the new user's email
  await new Email(newUser, url).sendWelcome();
  //return response to the user
  res.status(201).json({
    status: "success",
    data: {
      message:
        "Account created successfully.Check your email to verify your account.",
      newUser
    }
  });
  //SendToken(newUser, 201, res);
});

exports.restrictUserTo =
  (
    ...roles //["admin", "Employer", "superAdmin"]
  ) =>
  (req, res, next) => {
    if (
      (req.user != undefined && !roles.includes(req.user.role)) ||
      (res.locals.user != undefined && !roles.includes(res.locals.user.role))
    ) {
      return next(
        new AppError("Sorry you are not allowed to access this route", 403)
      );
    }
    next();
  };
