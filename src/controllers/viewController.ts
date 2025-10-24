// eslint-disable-next-line prettier/prettier
const Job = require("../src/models/jobModel");
const User = require("../src/models/userModel");
const APIFEATURES = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appErrors");

exports.homePage = (req, res) => {
  // Sets content security policy to allow access from other domain
  res
    .status(200)
    .header("Content-Security-Policy", "img-src 'self' data: https:")
    .render("base");
};

exports.jobs = catchAsync(async (req, res) => {
  // 1.) Get the jobs data from collection
  const results = new APIFEATURES(Job.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const jobs = await results.query;
  const page = results.page;
  // console.log(jobs);
  // render the jobs data to the template
  res
    .status(200)
    .header("Content-Security-Policy", "img-src 'self' data: https:")
    .render("job_default", { jobs, page });
});

exports.blog = catchAsync(async (req, res) => {
  res
    .status(200)
    .header("Content-Security-Policy", "img-src 'self' data: https:")
    .render("blog_default");
});

exports.training = catchAsync(async (req, res) => {
  res
    .status(200)
    .header("Content-Security-Policy", "img-src 'self' data: https:")
    .render("service_training");
});

exports.coaching = catchAsync(async (req, res) => {
  res
    .status(200)
    .header("Content-Security-Policy", "img-src 'self' data: https:")
    .render("service_coaching");
});

exports.recruitment = catchAsync(async (req, res) => {
  res
    .status(200)
    .header("Content-Security-Policy", "img-src 'self' data: https:")
    .render("service_recruitment");
});

exports.overview = catchAsync(async (req, res, next) => {
  const job = await Job.findOne({ _id: req.params.jobID });
  // console.log(job);
  if (!job) return next(new AppError("Job not found", 404));
  // eslint-disable-next-line no-unused-expressions
  res
    .status(200)
    .header("Content-Security-Policy", "img-src 'self' data: https:")
    .render("job_overview", { job });
});

exports.services = catchAsync(async (req, res) => {
  res
    .status(200)
    .header("Content-Security-Policy", "img-src 'self' data: https:")
    .render("service_default");
});

exports.contact = catchAsync(async (req, res) => {
  res
    .status(200)
    .header("Content-Security-Policy", "img-src 'self' data: https:")
    .render("contact");
});
exports.about = catchAsync(async (req, res) => {
  res
    .status(200)
    .header("Content-Security-Policy", "img-src 'self' data: https:")
    .render("about");
});

exports.readBlog = catchAsync(async (req, res) => {
  res
    .status(200)
    .header("Content-Security-Policy", "img-src 'self' data: https:")
    .render("blog_overview");
});

exports.signUp = catchAsync(async (req, res) => {
  res
    .status(200)
    .header("Content-Security-Policy", "img-src 'self' data: https:")
    .render("signUp");
});

// exports.employerSignUp= catchAsync(async (req,res)=>{
//   res
//     .status(200)
//     .header("Content-Security-Policy", "img-src 'self' data: https:")
//     .render("employerSignUp");
// })
exports.login = catchAsync(async (req, res) => {
  res
    .status(200)
    .header("Content-Security-Policy", "img-src 'self' data: https:")
    .render("login");
});

exports.forgetPassword = catchAsync(async (req, res) => {
  res
    .status(200)
    .header("Content-Security-Policy", "img-src 'self' data: https:")
    .render("forgetPassword");
});

exports.resetPassword = catchAsync(async (req, res) => {
  const resetToken = req.params.resetToken;
  res
    .status(200)
    .header("Content-Security-Policy", "img-src 'self' data: https:")
    .render("resetPassword", { resetToken });
});

exports.jobApply = catchAsync(async (req, res) => {
  res
    .status(200)
    .header("Content-Security-Policy", "img-src 'self' data: https:")
    .render("job_apply");
});

exports.verifyUserPage = catchAsync(async (req, res) => {
  res
    .status(200)
    .header("Content-Security-Policy", "img-src 'self' data: https:")
    .render("confirmation_page");
});

exports.postJob = catchAsync(async (req, res) => {
  res
    .status(200)
    .header("Content-Security-Policy", "img-src 'self' data:  https:")
    .render("postJob");
});

exports.dashboard = catchAsync(async (req, res) => {
  res
    .status(200)
    .header("Content-Security-Policy", "img-src 'self' data: https:")
    .render("admin");
});

exports.adminLogin = catchAsync(async (req, res) => {
  res
    .status(200)
    .header("Content-Security-Policy", "img-src 'self' data:https")
    .render("admin/admin-login");
});
