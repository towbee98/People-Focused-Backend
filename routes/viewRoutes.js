const express = require("express");

const viewRouter = express.Router();
const viewController = require("../controllers/viewController");

viewRouter.route("/").get(viewController.homePage);
viewRouter.route("/Jobs").get(viewController.jobs);
viewRouter.route("/Jobs/:id").get(viewController.overview);
viewRouter.route("/blog").get(viewController.blog);
viewRouter.route("/blog/:id").get(viewController.readBlog);
viewRouter.route("/training").get(viewController.training);
viewRouter.route("/coaching").get(viewController.coaching);
viewRouter.route("/recruitment").get(viewController.recruitment);
viewRouter.route("/services").get(viewController.services);
viewRouter.route("/contact").get(viewController.contact);
viewRouter.route("/about").get(viewController.about);
viewRouter.route("/signUp").get(viewController.signUp);
viewRouter.route("/login").get(viewController.login);
viewRouter.route("/forgetPassword").get(viewController.forgetPassword);
module.exports = viewRouter;
