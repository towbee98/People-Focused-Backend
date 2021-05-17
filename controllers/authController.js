const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/appErrors");

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
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    const token = req.headers.authorization.split(" ")[1];
  }
  //Verify the token
  jwt.verify(token);
  next();
});
