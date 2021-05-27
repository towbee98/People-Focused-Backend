const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const AppError = require("./utils/appErrors");
const globalErrorHandler = require("./controllers/errorController");
const jobRouter = require("./routes/jobRoutes");
const userRouter = require("./routes/userRoutes");
const app = express();

// GLobal Middlewares

//Create Security Headers
app.use(helmet());

//Development Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
//limit the number of requests from a particular IP
const apiLimiter = rateLimit({
  max: 80,
  windowMs: 60 * 60 * 1000,
  message: "Too much requests from this IP. Try again later",
});
app.use("/api", apiLimiter);

//parses the body to enable acces to body of the request
app.use(express.json({ limit: "80kb" }));

//Data Sanitization against NO SQL query Injection
app.use(mongoSanitize());

//Data Sanitization against XSS
app.use(xss());

//Data Sanitization against Parameter Pollution
app.use(
  hpp({
    whitelist: [
      "sort",
      "location",
      "Minimum Qualification",
      "Industry",
      "Salary.min",
      "Salary.max",
    ],
  })
);

//Test Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//ROUTES
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/users", userRouter);
app.all("*", (req, res, next) => {
  next(
    new AppError(
      `😧 Oops the page you requested for @${req.originalUrl} not found`,
      404
    )
  );
});

app.use(globalErrorHandler);
module.exports = app;
