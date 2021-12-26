const express = require("express");

const viewRouter = express.Router();
const viewController = require("../controllers/viewController");
const authController = require("../controllers/authController");

viewRouter.route("/").get(viewController.homePage);
viewRouter.route("/jobs/:jobID").get(viewController.overview);
viewRouter
  .route("/jobs/:jobID/apply")
  .get(authController.isLoggedIn, viewController.jobApply);
viewRouter
  .route("/jobs")
  .get(viewController.jobs);
viewRouter
  .route("/blog")
  .get(viewController.blog);
viewRouter
  .route("/blog/:blogID")
  .get(viewController.readBlog);
viewRouter
  .route("/training")
  .get(viewController.training);
viewRouter
  .route("/coaching")
  .get(viewController.coaching);
viewRouter
  .route("/recruitment")
  .get(viewController.recruitment);
viewRouter
  .route("/services")
  .get(viewController.services);
viewRouter
  .route("/contact")
  .get(viewController.contact);
viewRouter
  .route("/about")
  .get(viewController.about);
viewRouter
  .route("/signUp")
  .get(viewController.signUp);
viewRouter
  .route("/login")
  .get(viewController.login);
viewRouter
  .route("/forgetPassword")
  .get(viewController.forgetPassword);
viewRouter
  .route("/resetPassword/:resetToken")
  .get(viewController.resetPassword);
viewRouter
  .route("/users/confirm/:confirmCode")
  .get(authController.verifyUser,
    viewController.verifyUserPage);
viewRouter
  .route("/postJob")
  .get(authController.protect,
    authController.restrictUserTo("admin","Employer","superAdmin"),
    viewController.postJob)


module.exports = viewRouter;