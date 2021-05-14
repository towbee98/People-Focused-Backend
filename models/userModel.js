const mongoose = require("mongoose");
const validator = require("validator");
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
    default: "user",
    enum: ["admin", "user", "superAdmin"],
  },
});

const User = new Model("User", userSchema);

module.exports = User;
