const { title } = require("process");
const Jobs = require("./../models/jobModel");

//ROUTE HANDLERS

exports.getAllJobs = async (req, res) => {
  try {
    //Build Query
    //1.)Filtering
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);
    console.log(queryObj, req.query);
    //2.)Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = JSON.parse(
      queryStr.replace(/gte|gt|lt|lte/g, function (str) {
        return `$${str}`;
      })
    );
    console.log(queryStr);
    //Execute the query
    const query = Jobs.find(queryStr);
    const job = await query;
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
