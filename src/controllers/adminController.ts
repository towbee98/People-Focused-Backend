// const Admin = require("../src/models/adminModel");
import Admin from "../src/models/adminModel";
// const handlerFactory = require("./handlerFactory");
import handlerFactory from "./handlerFactory";
// const catchAsync = require("../utils/catchAsync");
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appErrors";
import generator from "generate-password";
// const AppError = require("../utils/appErrors");
// const generator = require("generate-password");

exports.login = handlerFactory.login(Admin);
exports.forgetPassword = handlerFactory.forgetPassword(Admin);
exports.resetPassword = handlerFactory.resetPassword(Admin);
exports.protect = handlerFactory.protect(Admin);

exports. reateNewAdmin = catchAsync(async (req, res, next) => {
  try {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = generator.generate({
      length: 14,
      numbers: true
    });
    console.log(password);
    const newAdmin = await Admin.create({
      firstname,
      lastname,
      email,
      password
    });
    //The password of the admin 1 created was 8RYzK2L9babd
    //The password of the admin 2 created was P0FrnPy3qgxtD3
    //The password of the super admin created was B2U5qFaM451d
    console.log(newAdmin);
    res.status(201).json({
      status: "success",
      message: "New admin was successfully created"
    });
  } catch (error) {
    console.log(error);
  }
});
