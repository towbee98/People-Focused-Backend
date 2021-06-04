const express = require("express");
const jobController = require("../controllers/jobController");
const authController = require("../controllers/authController");
const applicationController = require("./../controllers/applicationController");
const router = express.Router();

//router.param("id", jobController.checkID);

router
  .route("/latest-top-paying-jobs")
  .get(jobController.aliasTopJobs, jobController.getAllJobs);

router.route("/JobStats").get(jobController.getJobStats);

router
  .route("/")
  .get(jobController.getAllJobs)
  .post(
    authController.protect,
    authController.restrictUserTo("admin", "Employer", "superAdmin"),
    jobController.postAJob
  );

router.route("/apply/:jobID").post(applicationController.Apply);

router
  .route("/applications/:jobID")
  .get(
    authController.protect,
    authController.restrictUserTo("admin", "Employer", "superAdmin"),
    applicationController.getApplications
  );
router
  .route("/:id")
  .get(jobController.getJob)
  .patch(jobController.updateJob)
  .delete(
    authController.protect,
    authController.restrictUserTo("admin", "Employer", "superAdmin"),
    jobController.deleteJob
  );

module.exports = router;
