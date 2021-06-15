const mongoose = require("mongoose");
const validator = require("validator");

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

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;
