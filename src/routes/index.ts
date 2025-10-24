const express = require("express");
const jobRouter = require("./jobRoutes");
const userRouter = require("./userRoutes");
const adminRouter = require("./adminRoute");

const router = express.Router();

router.use("/jobs", jobRouter);
router.use("/users", userRouter);
router.use("/admin", adminRouter);

module.exports = router;
