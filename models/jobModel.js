const mongoose = require("mongoose");
const slugify = require("slugify");
const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job Title cannot be empty"],
    },
    slug: String,
    organisation: {
      name: {
        type: String,
        required: [true, "Enter the name ofd the organisation"],
      },
      description: {
        type: String,
        required: [true, "Enter the description of the organisation"],
      },
      website: {
        type: String,
      },
    },
    location: {
      address: {
        type: String,
        required: [true, "Enter the address of the job"],
      },
      city: {
        type: String,
        required: [true, "Enter the city"],
      },
      State: {
        type: String,
        required: [true, "Enter the state"],
      },
      Country: {
        type: String,
        default: "NIgeria",
      },
    },
    "work type": {
      type: String,
      required: [true, "Specify  the type of work"],
      lowercase: true,
    },
    Category: {
      name: {
        type: String,
        required: [true, "Specify the category the company belongs to"],
      },
      description: {
        type: "String",
      },
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
    Deadline: {
      type: Date,
      validate: {
        validator: function (value) {
          return this.createdAt < value;
        },
        message: "Deadline cannot come before the day job was posted",
      },
    },
  }
  // { timestamps: true }
);

jobSchema.index({ title: 1, Employer: 1 }, { unique: true });

//DOCUMENT MIDDLEWARE
jobSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: false });
  next();
});
jobSchema.post("save", function (docs, next) {
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
