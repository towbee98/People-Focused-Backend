const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

const Application = require("./../models/applicationsModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appErrors");

//console.log(require("./../server").Conn)
const multerStorage = new GridFsStorage({
  db: require("./../server").Conn,
  file: (req, file) => {
    return {
        filename: `${file.fieldname}-of-${req.params.jobID}-${
          req.body.name
        }-${Date.now()}.${file.mimetype.split("/")[1]}`,
        bucketName: "applications",
      
    };
  },
});

//const multerStorage = multer.memoryStorage();

//This prevents the upload of every other files apart from pdf files
const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[1] === "pdf") {
    cb(null, true);
  } else {
    cb(new AppError("Please only pdf files are allowed", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 500000 },
});

//Filter the request body to extract the only needed
const filterReqBody = (obj, ...params) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (params.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.uploadCV = upload.single("cv");

//Apply for a particular job
exports.Apply = catchAsync(async (req, res, next) => {
  //filter out unecessary data from the request body
  console.log(req.file)
  const filteredBody = filterReqBody(req.body, "name", "email", "experience");
  //add the job being applied to
  if (!req.body.Job) filteredBody.Job = req.params.jobID;
  if (!req.file) return next(new AppError("Upload your cv please", 400));
  filteredBody.document = req.file.filename; //Add the filename of the cv being uploaded
  const application = await Application.create(filteredBody);
  res.status(200).json({
    status: "success",
    message: "Application submitted succesfully!!",
    application,
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
