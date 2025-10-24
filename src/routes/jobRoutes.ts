const express = require("express");

const jobController = require("../src/controllers/jobController");
const authController = require("../src/controllers/authController");
const applicationController = require("../src/controllers/applicationController");
const adminController = require("../src/controllers/adminController");
const router = express.Router();

// const upload = multer({ dest: "public/resumes" });

// router.param("id", jobController.checkID);

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

router
  .route("/myJobs")
  .get(
    authController.protect,
    authController.restrictUserTo("admin", "Employer", "superAdmin"),
    jobController.getMyJobs
  );
// router.route("/:id/applications", applicationRouter);
router
  .route("/:jobID")
  .get(jobController.getJob)
  .patch(
    adminController.protect,
    authController.restrictUserTo("admin", "Employer", "superAdmin"),
    jobController.updateJob
  )
  .delete(
    adminController.protect,
    authController.restrictUserTo("admin", "Employer", "superAdmin"),
    jobController.deleteJob
  );

router
  .route("/:jobID/apply")
  .post(
    authController.protect,
    authController.restrictUserTo("jobSeeker"),
    applicationController.uploadCV,
    applicationController.Apply
  );

router
  .route("/:jobID/applications")
  .get(
    adminController.protect,
    authController.restrictUserTo("admin", "Employer", "superAdmin"),
    applicationController.getApplications
  );

module.exports = router;
