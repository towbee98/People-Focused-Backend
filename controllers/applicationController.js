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
exports.Apply = catchAsync(async (req, res, next) => {
  const filteredBody = filterReqBody(
    req.body,
    "name",
    "email",
    "document",
    "experience"
  );
  filteredBody.Job = req.params.jobID;

  const application = await Application.create(filteredBody);
  res.status(200).json({
    status: "success",
    data: application,
  });
});

exports.getApplications = catchAsync(async (req, res, next) => {
  console.log(req.params.jobID);
  const applications = await Application.findOne({ Job: req.params.jobID });
  console.log(applications);
  if (!applications) return next(new AppError("The job does not exist", 404));
  res.status(200).json({
    status: "success",
    data: {
      applications,
    },
  });
});
