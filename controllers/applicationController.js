const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
dotenv.config({ path: "./config.env" });
const Application = require("./../models/applicationsModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appErrors");

//Set the cloudinary configuration
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.cloud_api_key,
  api_secret: process.env.cloud_api_secret,
  secure: true,
});

//Set the multer storage
const multerStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "peoplefocused-applications",
    format: (req, file) => "pdf",
    public_id: (req, file) =>
      `${req.user.firstname}-${req.user.lastName}-${req.user._id}-${req.params.jobID}`,
  },
});
//This prevents the upload of every other files apart from pdf files
const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[1] === "pdf") {
    cb(null, true);
  } else {
    cb(new AppError("Please only pdf files are allowed", 400), false);
  }
};

const upload = multer({
  limits: { fileSize: 500000 },
  fileFilter: multerFilter,
  storage: multerStorage,
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
  const filteredBody = filterReqBody(req.body, "experience");

  //Add the job being applied to
  if (!req.body.Job) filteredBody.Job = req.params.jobID;

  if (!req.file) return next(new AppError("Upload your cv please", 400));

  //console.log(req.user);
  //Add the filename of the cv being uploaded
  filteredBody.document = req.file.filename;
  filteredBody.name = `${req.user.firstname} ${req.user.lastName}`;
  filteredBody.email = req.user.email;

  // let application = await Application.findOne({
  //   document: filteredBody.document,
  // });
  // //Check if application exists
  // if (application) {
  //   res.status(400).json({
  //     status: "fail",
  //     message: "Application already exists",
  //   });
  // } else {
  application = await Application.create(filteredBody);
  res.status(200).json({
    status: "success",
    message: "Application submitted successfully!!",
    application,
  });
});

exports.getMyApplications = catchAsync(async (req, res, next) => {});
//Get all applications for a particular job
exports.getApplications = catchAsync(async (req, res, next) => {
  //Get all the applications
  let job;
  if (!req.body.Job) job = req.params.jobID;
  if (req.user.role != "Employer") {
    const applications = await Application.find({ Job: job }).select("-__v -Job");
    if (!applications) return next(new AppError("The job does not exist", 404));
    res.status(200).json({
      status: "success",
      result: applications.length,
      data: {
        applications,
      },
    });
  } else {
    //Employer only access the appliactions of job he posted
  }
});

//Get all files for a particular job
// exports.getFiles = catchAsync(async (req, res, next) => {
//  //get all the submitted cvs  for a particular job
//  gfs.find().toArray((err,files))=>{
//    if()
//  }

// });
