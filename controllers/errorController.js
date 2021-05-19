const AppError = require("./../utils/appErrors");

//handles invalid database ID
const handleCastErrorDB = (err) => {
  // console.log(error);
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

//Handles jwt errors
const handleJWTError = (err) => {
  return new AppError(`${err.message} , Please login again`, 401);
};

//handles duplicate error
const handleDuplicateErrorDB = (err) => {
  const extractedDuplicateValue = err.message.match(/([""'])(?:(?=(\\?))\2.)*?\1/g);
  //console.log(quotedValue);
  const message = `Duplicate field value(s): ${extractedDuplicateValue}, Try using another value(s)`;
  return new AppError(message, 400);
};

//handles validation error
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid Input data: ${errors.join(" and ")}`;
  return new AppError(message, 400);
};
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.statusCode,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // console.log("🦡🎆 Error:", err);
    res.status(500).json({
      status: "error",
      message: "🔥 Oops , Something went wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    //console.log(err.name);
    if (err.name === "CastError") {
      error = handleCastErrorDB(error);
    }
    if (err.code === 11000) {
      //console.log(err.message);
      error = handleDuplicateErrorDB(err);
    }
    if (err.name === "ValidationError") {
      //console.log(error.errors);
      error = handleValidationErrorDB(error);
    }
    if (err.name === "JsonWebTokenError") {
      error = handleJWTError(error);
    }
    sendErrorProd(error, res);
  } else if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  }
};
