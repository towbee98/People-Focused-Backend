const mongoose = require("mongoose");
const validator = require("validator");
const Jobs = require("./../models/jobModel");
const AppError = require("./../utils/appErrors");
const applicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Enter your name"],
    lowerCase: true,
  },
  email: {
    type: String,
    required: [true, "Email cannot be empty"],
    validate: [validator.isEmail, "Enter a valid email"],
  },
  document: {
    type: String,
    required: [true, "Please enter a valid document"],
  },
  experience: {
    type: Number,
    required: [true, "Specify your year of experience "],
  },
  Job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Jobs",
    required: true,
  },
});
//Prevent duplicate application for a specific job
applicationSchema.index({ email: 1, Job: 1 }, { unique: true });

//Check if the job being applied for exist
applicationSchema.pre("save", async function (next) {
  if (this.Job) {
    const jobExist = await Jobs.findOne({ _id: this.Job });
    if (!jobExist) return next(new AppError("Job not found", 404));
    next();
  } else {
    return next(new AppError("Job cannot be empty", 400));
  }
});

//
// applicationSchema.pre("find", async function (next) {
//   this.populate("Job", "user");

//   next()
// });
const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;
