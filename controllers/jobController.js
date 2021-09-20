const Jobs = require("./../models/jobModel");
//const Application = require("./../models/applicationsModel");
const APIFEATURES = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appErrors");
const factory = require("./handlerFactory");

//ROUTE HANDLERS
//Get latest Top Paid Jobs
exports.aliasTopJobs = async (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "createdAt,-Salary.max";
  req.query.page = "1";
  next();
};

//Get all latest jobs
exports.getAllJobs = factory.getAll(Jobs);

//Get a particular job
exports.getJob = factory.getOne(Jobs);

//Post a job Opening
exports.postAJob = catchAsync(async (req, res, next) => {
  //console.log(req.body);
  req.body.user = req.user._id;
  const newJob = await Jobs.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      newJob,
    },
  });
});

//Update a particular job
exports.updateJob = catchAsync(async (req, res, next) => {
  const job = await Jobs.findByIdAndUpdate(req.params.jobID, req.body, {
    new: true,
    runValidators: true,
  });

  if (!job) {
    return next(new AppError("Job with that ID not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      job,
    },
  });
});

//delete a job
exports.deleteJob = catchAsync(async (req, res, next) => {
  const job = await Jobs.findByIdAndDelete(req.params.jobID);

  if (!job) {
    return next(new AppError("Job with that ID not found", 404));
  }
  res.status(204).json({
    status: "success",
    data: {},
  });
});

//Statistics of the jobs available
exports.getJobStats = catchAsync(async (req, res, next) => {
  const stats = await Jobs.aggregate([
    {
      $match: { "Salary.min": { $gte: 70000 } },
    },
    {
      $group: {
        _id: { $toUpper: "$location" },
        // _id: "$title",
        numJobs: { $sum: 1 },
        highestPaidJob: { $max: "$Salary.max" },
        lowestpaidJob: { $min: "$Salary.min" },
      },
    },
    { $sort: { highestPaidJob: 1 } },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

//Allow an employer or administrator to query all the jobs he has posted on the site
exports.getMyJobs = catchAsync(async (req, res, next) => {
  const jobs = await Jobs.find({ user: req.user._id }).select(
    "title location.city organisation.name Category.name"
  );
  if (!jobs) return next(new AppError("You have not posted any job yet", 404));
  res.status(200).json({
    status: "success",
    result: jobs.length,
    data: jobs,
  });
});
