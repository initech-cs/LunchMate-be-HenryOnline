const jwt = require("jsonwebtoken");
const { catchAsync, AppError } = require("../utils/appError");

exports.verifyToken = catchAsync(async (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) return next(new AppError(401, "Access denied"));
  const verified = jwt.verify(token, process.env.SECRET);
  req.user = verified;
  console.log(req.user);
  next();
});
