const express = require("express");

const adminController = require("../controllers/adminController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/login").post(adminController.login);
router.route("/forgetPassword").post(adminController.forgetPassword);
router.route("/resetPassword/:token").patch(adminController.resetPassword);

router.use(adminController.protect);
router
  .route("/register")
  .post(
    authController.restrictUserTo("superAdmin"),
    adminController.createNewAdmin
  );

module.exports = router;
