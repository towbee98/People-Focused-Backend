const Application = require("./../models/applicationsModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appErrors");

const filterReqBody = (obj, ...params) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (params.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

//Apply for a particular job
exports.Apply = catchAsync(async (req, res) => {
  const filteredBody = filterReqBody(req.body, "name", "email", "experience");
  if (!req.body.Job) filteredBody.Job = req.params.jobID;
  console.log(filteredBody);
  const application = await Application.create(filteredBody);
  res.status(200).json({
    status: "success",
    data: application,
  });
});

//Get all applications for a particular job
exports.getApplications = catchAsync(async (req, res, next) => {
  //Get all the applications
  let job;
  if (!req.body.Job) job = req.params.job.jobID;
  const applications = await Application.find({ Job: job }).select("-__v -Job");

  if (!applications) return next(new AppError("The job does not exist", 404));

  res.status(200).json({
    status: "success",
    result: applications.length,
    data: {
      applications,
    },
  });
});
