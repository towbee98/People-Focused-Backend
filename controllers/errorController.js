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
  const extractedDuplicateValue = err.message.match(
    /([""'])(?:(?=(\\?))\2.)*?\1/g
  );
  const duplicateEmail = err.message.match(/email/i)[0];
  if (duplicateEmail == "email") {
    return new AppError("Email already exists, Try another one!", 400);
  }
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
  //console.log(err);
  res.status(err.statusCode).json({
    status: err.statusCode,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  //console.log(err.message);
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.log("🦡🎆 Error:", err);
    res.status(500).json({
      status: "error",
      message: "🔥 Oops , Something went wrong!"
    });
    // res.status(500)
    // .header("Content-Security-Policy","img-src 'self' data:  https:")
    // .render('server-error',{message:"🔥 Oops , Something went wrong!"});
  }
};

module.exports = (err, req, res, next) => {
  // console.log(err.message)
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "production") {
    // let error = { ...err };
    // console.log(error.message)
    if (err.name === "CastError") {
      err = handleCastErrorDB(err);
    }
    if (err.code === 11000) {
      //console.log(err.message);
      err = handleDuplicateErrorDB(err);
    }
    if (err.name === "ValidationError") {
      //console.log(error.errors);
      err = handleValidationErrorDB(err);
    }
    if (err.name === "JsonWebTokenError") {
      err = handleJWTError(err);
    }
    sendErrorProd(err, res);
  } else {
    sendErrorDev(err, res);
  }
};
