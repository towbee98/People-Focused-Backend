/* eslint-disable arrow-body-style */
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appErrors");
const APIFEATURES = require("../utils/apiFeatures");

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
      data: docs,
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
        doc,
      },
    });
  });
};
