// const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Application = require("../models/applicationsModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appErrors");
// const { callbackPromise } = require("nodemailer/lib/shared");

// Set the cloudinary configuration
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.cloud_api_key,
  api_secret: process.env.cloud_api_secret,
  secure: true
});

// Set the multer storage
const multerStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "peoplefocused-applications",
    // eslint-disable-next-line no-unused-vars
    format: (req, file) => "pdf",
    // eslint-disable-next-line no-unused-vars
    public_id: (req, file) =>
      `${req.user.firstname}-${req.user.lastName}-${req.user._id}-${req.params.jobID}`
  }
});

// This prevents the upload of every other files apart from pdf files
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
  storage: multerStorage
});

// Filter the request body to extract the only needed
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

// Apply for a particular job
exports.Apply = catchAsync(async (req, res, next) => {
  // filter out unecessary data from the request body
  const filteredBody = filterReqBody(req.body, "experience");

  // Add the job being applied to
  if (!req.body.Job) filteredBody.Job = req.params.jobID;

  if (!req.file) return next(new AppError("Upload your cv please", 400));

  // console.log(req.user);
  // Add the filename of the cv being uploaded
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
  const application = await Application.create(filteredBody);
  res.status(200).json({
    status: "success",
    message: "Application submitted successfully!!",
    application
  });
});

// Get all applications for a particular job
exports.getApplications = catchAsync(async (req, res, next) => {
  // Get all the applications
  // eslint-disable-next-line one-var
  let job, query;
  // console.log(req.user);
  if (!req.body.Job) job = req.params.jobID;

  // This allows the admin and superAdmin to get all applications for a particular job
  if (req.user.role !== "Employer") {
    query = await Application.find({ Job: job });
  } else {
    // Restricts an employer to only view the job he posted
    query = await Application.find({ Job: job }).populate("Job", "user");
    // Remove all job applications that was not posted by the employer
    query.forEach((el) => {
      if (`${el.Job.user}` !== `${req.user._id}`) {
        query.pop(el);
      }
    });
  }
  if (!query) return next(new AppError("The job does not exist", 404));
  res.status(200).json({
    status: "success",
    result: query.length,
    data: query
  });
});

// Get all files for a particular job
// exports.getFiles = catchAsync(async (req, res, next) => {
//  //get all the submitted cvs  for a particular job
//  gfs.find().toArray((err,files))=>{
//    if()
//  }
// });
