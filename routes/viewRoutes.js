const express = require("express");

const viewRouter = express.Router();
const viewController = require("../controllers/viewController");

viewRouter.route("/").get(viewController.homePage);
viewRouter.route("/Jobs").get(viewController.jobs);

module.exports = viewRouter;
