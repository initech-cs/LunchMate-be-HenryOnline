const errorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const errorProduction = (err, res) => {
  // send our operational errors
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log("❗️ERROR❗️", err);
    // for programming errors we just send general message
    res.status(500).json({
      status: err.status,
      message: "Something went terribly wrong",
    });
  }
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(400, message);
};

const handleDuplicateErrorDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
  const message = `Duplicate field value: ${value[0]}, please try again with different value`;
  return new AppError(400, message);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(400, message);
};

exports.errorController = (err, req, res, next) => {
  // default err object of undefined
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    errorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    // don't directly modify the err object.
    let error = { ...err };

    // invalid field format (mongodb)
    if (error.name === "CastError") error = handleCastErrorDB(error);

    // duplicate error (generated by mongodb driver: mongoose)
    if (error.code === 11000) error = handleDuplicateErrorDB(error);

    // mongoose validation error
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);

    errorProduction(error, res);
  }
};
