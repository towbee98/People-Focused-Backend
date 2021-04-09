const express = require("express");
const morgan = require("morgan");

const jobRouter = require("./routes/jobRoutes");
const userRouter = require("./routes/userRoutes");
const app = express();

//Middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json()); //this middleware allow us to access req.body

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//ROUTES
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
