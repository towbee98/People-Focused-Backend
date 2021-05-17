const express = require("express");
const jobController = require("../controllers/jobController");
const authController = require("../controllers/authController");
const router = express.Router();

//router.param("id", jobController.checkID);
router
  .route("/latest-top-paying-jobs")
  .get(jobController.aliasTopJobs, jobController.getAllJobs);

router.route("/JobStats").get(jobController.getJobStats);

router
  .route("/")
  .get(jobController.getAllJobs)
  .post(authController.protect, jobController.postAJob);

router
  .route("/:id")
  .get(jobController.getJob)
  .patch(jobController.updateJob)
  .delete(jobController.deleteJob);

module.exports = router;
