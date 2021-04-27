const mongoose = require("mongoose");
const slugify = require("slugify");
const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job Title cannot be empty"],
    },
    slug: String,
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
      lowercase: true,
    },
    "work type": {
      type: String,
      required: [true, "Specify  the type of work"],
      lowercase: true,
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
      uppercase: true,
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
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  }
  // { timestamps: true }
);

//DOCUMENT MIDDLEWARE
jobSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: false });
  next();
});
jobSchema.post("save", function (next) {
  console.log(this);
  next();
});
//QUERY MIDDLEWARE
jobSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});
jobSchema.post(/^find/, function (docs, next) {
  console.log(`Query took us ${Date.now() - this.start} milliseconds`);
  next();
});
//AGGREGATE MIDDLEWARE

const Jobs = mongoose.model("Jobs", jobSchema);

module.exports = Jobs;
