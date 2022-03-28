const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.route("/signup").post(authController.signUp);
router.route("/login").post(authController.login);
router.route("/forgotPassword").post(authController.forgetPassword);
router.route("/resetPassword/:token").patch(authController.resetPassword);
router.route("/confirm/:confirmCode").get(authController.verifyUser);

// Authenticates the user before they can access the page

router
  .route("/updatePassword")
  .patch(authController.protect, authController.updatePassword);
router.route("/me").get(authController.protect, userController.getMe);
router
  .route("/updateMe")
  .patch(authController.protect, userController.updateMe);
router
  .route("/deleteMe")
  .delete(authController.protect, userController.deleteMe);

router.use(authController.restrictUserTo("admin", "superAdmin"));
router.use(adminController.protect);
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
