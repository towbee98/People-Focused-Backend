const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/signup").post(authController.signUp);
router.route("/login").post(authController.login);
router.route("/forgotPassword").post(authController.forgotPassword);
router.route("/resetPassword/:token").patch(authController.resetPassword);
//router.route("/confirm/:confirmCode").get(authController.verifyUser);

// Authenticates the user before they can access the page
router.use(authController.protect);
router.route("/updatePassword").patch(authController.updatePassword);
router.route("/me").get(userController.getMe);
router.route("/updateMe").patch(userController.updateMe);
router.route("/deleteMe").delete(userController.deleteMe);

router.use(authController.restrictUserTo("admin", "superAdmin"));
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
