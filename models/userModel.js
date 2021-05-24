const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
//const slugify= require("slugify");
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Enter the first name"],
    maxlength: [16, "Firstname cannot exceed 16 characters"],
  },
  lastName: {
    type: String,
    required: [true, "Last Name cannot be empty"],
    maxlength: [16, "Last name cannot exceed 16 charaters"],
  },
  email: {
    type: String,
    required: [true, "Email cannot be empty"],
    unique: [true, "Email already exists"],
    validate: [validator.isEmail, "Please enter a valid email "],
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Enter a valid password"],
    maxlength: [10, "Sorry password cannot exceed 10 characters"],
    minlength: [7, "Sorry password cannot be less than 7 characters"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Enter a valid passwordConfirm"],
    maxlength: [10, "Sorry passwordConfirm cannot exceed 10 characters"],
    minlength: [7, "Sorry Password cannot be less than the 7 characters"],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: "Sorry the passwordConfirm must match the password",
    },
    select: false,
  },
  role: {
    type: String,
    enum: ["admin", "jobSeeker", "Employer", "superAdmin"],
    default: "jobSeeker",

    // select: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre("save", async function (next) {
  //Check if password was modified
  if (!this.isModified("password")) return next();

  //encrypt the password using a salt of 12
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

//This methods check if a password is valid
userSchema.methods.checkPassword = async function (
  originalPassword,
  userPassword
) {
  return await bcrypt.compare(userPassword, originalPassword);
};

//this method checks if a user has changed his login credentials after JWt was issued
userSchema.methods.changedPasswordAfter = function (JwtTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JwtTimeStamp < changedTimeStamp;
  }
  //Return this if the no password was changed after JWT was issued
  return false;
};

userSchema.methods.createPasswordResetToken = async function () {
  //genrate a token to send to the user
  const resetToken = await crypto.randomBytes(32).toString("hex");

  //Encrypt the token before storing in the database
  this.passwordResetToken = await crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
