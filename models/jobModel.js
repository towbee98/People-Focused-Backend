const mongoose = require("mongoose");
const slugify = require("slugify");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job Title cannot be empty"]
    },
    slug: String,
    organisation: {
      name: {
        type: String,
        required: [true, "Enter the name of the organisation"]
      },
      description: {
        type: String,
        required: [true, "Enter the description of the organisation"]
      },
      email: {
        type: String,
        required: [true, "Enter the company's email address"]
      }
    },
    location: {
      address: {
        type: String,
        required: [true, "Enter the  Street Address "]
      },
      city: {
        type: String,
        required: [true, "Enter the city"]
      },
      Country: {
        type: String,
        default: "Nigeria"
      }
    },
    phone: {
      type: String
    },
    sendUpdatesToEmail: {
      type: String
    },
    linksToJob: {
      link1: {
        type: String,
        required: [true, "Please specify an external link to jobs"]
      },
      link2: {
        type: String
      },
      link3: {
        type: String
      }
    },
    contractTypes: {
      type: [String],
      required: [true, "Specify  the type of contract"],
      enum: [
        "Temporary",
        "Internship",
        "Contract",
        "Commission",
        "New grad",
        "Permanent"
      ],
      lowercase: true
    },
    employmentType: {
      type: String,
      enum: ["Full Time", "Part Time"]
    },
    Remote: {
      type: String,
      enum: ["True", "False"],
      required: [true, "Specify whether it is on site or remote"]
    },
    Category: {
      name: {
        type: String,
        enum: [
          "Agriculture",
          "Architecture And Construction",
          "Education and Training",
          "Business Management And Administration",
          "Marketing",
          "Hospitality And Tourism",
          "Information Technology",
          "Transportation and Logistics",
          "Others"
        ],
        required: [true, "Specify the category the company belongs to"]
      }
    },
    Salary: {
      min: {
        type: Number
      },
      max: {
        type: Number,
        validate: function (value) {
          return value > this.Salary.min;
        },
        message: "The maximum salary must be greater than the minimum salary."
      },
      SalaryBasis: {
        type: String,
        enum: ["monthly", "yearly", "weekly", "daily"],
        lowercase: true
      }
    },
    "Minimum Qualification": {
      type: String,
      enum: [
        "SSCE",
        "NCE",
        "ND",
        "HND",
        "UNDERGRADUATE",
        "MASTERS",
        "DOCTORATE"
      ],
      uppercase: true
    },
    submitCV: {
      type: String,
      enum: ["yes", "no"]
    },
    "Experience Level": {
      type: String,
      enum: ["Junior", "Intermediate", "Senior"]
    },
    "Experience Length": {
      type: Number
    },
    "Job Summary": {
      type: String
    },
    "Job Description": {
      type: String
    },
    numberOfHires: {
      type: Number
    },
    // Responsiblities: {
    //   type: Array,
    // },
    // Requirements: {
    //   type: Array,
    // },
    sendUpdateTo: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    Deadline: {
      type: Date,
      validate: {
        validator: function (value) {
          return this.createdAt < value;
        },
        message: "Deadline must be after the job was posted"
      }
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "The job poster cannot be empty"]
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }
  // { timestamps: true }
);

// This prvents duplicate job (jobs with the same title and organisation name) from being posted
jobSchema.index({ title: 1, "organisation.name": 1 }, { unique: true });

// DOCUMENT MIDDLEWARE
jobSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: false });
  next();
});
// jobSchema.post("save", function (docs, next) {
//   console.log(this);
//   next();
// });

// QUERY MIDDLEWARE
jobSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

jobSchema.post(/^find/, function (docs, next) {
  console.log(`Query took us ${Date.now() - this.start} milliseconds`);
  next();
});

// AGGREGATE MIDDLEWARE

const Jobs = mongoose.model("Jobs", jobSchema);
module.exports = Jobs;
