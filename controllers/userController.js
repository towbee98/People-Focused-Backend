const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appErrors");

const filterBody = (obj, ...parameter) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (parameter.includes(el)) {
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
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //verify if password or passwordConfirm does not exists in the req.body
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError("Sorry you cannot update your password via this route, ", 400)
    );
  }
  //Remove unwanted fields that are not allowed to be updated
  filteredObj = filterBody(req.body, "firstname", "lastName", "email");
  console.log(filteredObj);
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
