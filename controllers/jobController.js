const { title } = require("process");
const Jobs = require("./../models/jobModel");
const APIFEATURES = require("./../utils/apiFeatures");
//

//ROUTE HANDLERS
exports.aliasTopJobs = async (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "createdAt,-Salary.max";
  req.query.page = "1";
  next();
};
exports.getAllJobs = async (req, res) => {
  try {
    //Execute the query
    const features = new APIFEATURES(Jobs.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const job = await features.query;
    res.status(200).json({
      status: "success",
      requestMadeAt: req.requestTime,
      result: job.length,
      data: {
        job,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getJob = async (req, res) => {
  try {
    const job = await Jobs.findById(req.params.id);
    res.status(200).json({
      status: "success",
      requestMadeAt: req.requestTime,
      data: {
        job,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.postAJob = async (req, res) => {
  try {
    const newJob = await Jobs.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        newJob,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Jobs.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        job,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Jobs.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: {},
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

exports.getJobStats = async (req, res) => {};
