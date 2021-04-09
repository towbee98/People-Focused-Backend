const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Job Title cannot be empty"],
  },
  Employer: {
    type: String,
    required: [true, "Employer name cannot be empty"],
  },
  "Company division": {
    type: String,
    required: [true, "Specify the part of the company the job is "],
  },
  location: {
    type: String,
    required: [true, "location cannot be empty"],
  },
  "work type": {
    type: String,
    required: [true, "Specify  the type of work"],
  },
  Industry: {
    type: String,
    required: [true, "Specify the industry the company belongs to"],
  },
  Salary: {
    min: {
      type: Number,
    },
    max: {
      type: Number,
    },
  },
  "Minimum Qualification": {
    type: String,
    enum: ["SSCE", "OND", "HND", "DEGREE"],
  },
  "Experience Level": {
    type: String,
  },
  "Experience Length": {
    type: String,
  },
  "Job Summary": {
    type: String,
  },
  Responsiblities: {
    type: Array,
  },
  Requirements: {
    type: Array,
  },
  Skillset: {
    type: Array,
  },
});

const Jobs = mongoose.model("Jobs", jobSchema);

module.exports = Jobs;
