const { title } = require("process");
const Jobs = require("./../models/jobModel");

//ROUTE HANDLERS

exports.getAllJobs = async (req, res) => {
  try {
    //Build Query
    //1a.)Filtering
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    //1b.)Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = JSON.parse(
      queryStr.replace(/gte|gt|lt|lte/g, (str) => {
        return `$${str}`;
      })
    );
    //Execute the query
    let query = Jobs.find(queryStr);

    //2.)Sorting
    if (req.query.sort) {
      const sortStr = req.query.sort.split(",").join(" ");
      query = query.sort(sortStr);
    } else {
      query.sort("-createdAt");
    }
    //3.)Limit fields
    if (req.query.fields) {
      const field = req.query.fields.split(",").join(" ");
      query = query.select(field);
    } else {
      query = query.select("-__v");
    }
    //4.)Pagination

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
