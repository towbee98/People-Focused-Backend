const mongoose = require("mongoose");
const crypto = require("crypto");
// const mongoose = require("./../server");
const validator = require("validator");
const bcrypt = require("bcrypt");
const generator = require("generate-password");

const adminSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Enter the first name"],
    maxlength: [16, "Firstname cannot exceed 16 characters"]
  },
  lastname: {
    type: String,
    required: [true, "Last Name cannot be empty"],
    maxlength: [16, "Last name cannot exceed 16 charaters"]
  },
  email: {
    type: String,
    required: [true, "Email cannot be empty"],
    unique: [true, "Email already exists"],
    validate: [validator.isEmail, "Please enter a valid email "],
    lowercase: true
  },
  password: {
    type: String,
    required: [true, "Enter a valid password"],
    maxlength: [14, "Sorry password cannot exceed 10 characters"],
    minlength: [7, "Sorry password cannot be less than 7 characters"],
    select: false
  },
  role: {
    type: String,
    enum: ["admin", "superAdmin"],
    default: "admin"

    // select: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
});

adminSchema.pre("save", async function (next) {
  // Check if password was modified
  if (!this.isModified("password")) return next();

  // encrypt the password using a salt of 12
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

adminSchema.pre("save", async function (next) {
  // Check if password was modified
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  console.log(this.passwordChangedAt);
  next();
});

adminSchema.pre(/^find/, async function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// //This method generates a random password for a new admin
// adminSchema.methods.generatePassword = async function () {
//   const password = await generator.generate({
//     length: 12,
//     numbers: true
//   });

//   return password;
// };
// This methods check if a password is valid
adminSchema.methods.checkPassword = async function (
  originalPassword,
  userPassword
) {
  return await bcrypt.compare(userPassword, originalPassword);
};

// this method checks if a user has changed his login credentials after JWt was issued
adminSchema.methods.changedPasswordAfter = function (JwtTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JwtTimeStamp < changedTimeStamp;
  }
  // Return this if no password was changed after JWT was issued
  return false;
};

adminSchema.methods.createPasswordResetToken = async function () {
  // generate a token to send to the user
  const resetToken = await crypto.randomBytes(32).toString("hex");
  // Encrypt the token before storing in the database
  this.passwordResetToken = await crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // Make the password reset token valid for 10 mins
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
