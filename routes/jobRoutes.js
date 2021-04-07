const express = require("express");

const jobController = require("../controllers/jobController");
const router = express.Router();

router.param("id", jobController.checkID);
router
  .route("/")
  .get(jobController.getAllJobs)
  .post(jobController.checkBody, jobController.postAJob);
router
  .route("/:id")
  .get(jobController.getJob)
  .patch(jobController.updateJob)
  .delete(jobController.deleteJob);

module.exports = router;
