const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appErrors");

//Function to filter a request body
const filterBody = (obj, ...params) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (params.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});
exports.createUser = (req, res) => {
  res.status(403).json({
    status: "error",
    message: "Sorry please use this sign up link to create a new user",
  });
};
exports.getUser = catchAsync(async (req, res, next) => {
  const newUser = await User.findById({ _id: req.params._id });
  if (!user) next(new AppError("User not found ", 404));
  res.status(200).json({
    status: "success",
    newUser,
  });
});

//Update a particular user details excluding the password
exports.updateUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    next(
      new AppError("Sorry you cannot update user password via this route", 400)
    );
  const updatedUser = User.findOneAndUpdate(req.params._id, req.body, {
    runValidators: true,
    new: true,
  });
  if (!updatedUser) return next(new AppError("Sorry No user  found ", 404));

  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});

//Delete a particular user
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = User.findByIdAndDelete(req.params.id);
  if (!user) return next(new AppError("User not found", 404));
  res.status(204).json({
    status: "success",
  });
});

//Get the currently logged in user details
exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select(
    "-passwordChangedAt -__v -active"
  );
  if (!user) return next(new AppError("User not found .", 404));
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

//Allow a user to update his/her details
exports.updateMe = catchAsync(async (req, res, next) => {
  //verify if password or passwordConfirm does not exists in the req.body
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError("Sorry you cannot update your password via this route, ", 400)
    );
  }
  //Remove unwanted fields that are not allowed to be updated
  filteredObj = filterBody(req.body, "firstname", "lastName", "email");

  //Update the user
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredObj, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { active: false },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(204).json({
    status: "success",
    data: null,
  });
});
