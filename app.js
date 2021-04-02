const express = require("express");
const morgan = require("morgan");

const jobRouter = require("./routes/jobRoutes");
const userRouter = require("./routes/userRoutes");
const app = express();

//Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//ROUTES
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
