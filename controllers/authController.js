const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appErrors");
//const { compareSync } = require("bcrypt");

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
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
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
  validUser.changedPasswordAfter(verifiedToken.iat);
  next();
});
