const User = require("./../models/userModels.js");
const catchAsync = require("./../utils/catchAsync");

exports.signUp = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});
