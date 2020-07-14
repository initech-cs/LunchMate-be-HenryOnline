const User = require("../models/user");
const validator = require("validator");
const { catchAsync, AppError } = require("../utils/appError");

exports.createUser = catchAsync(async (req, res, next) => {
  const { name, age, username, email, password } = req.body;
  if (!name || !age || !username || !email || !password) {
    next(new AppError(400, "Missing fields"));
  }
  if (!validator.isEmail(email)) {
    return next(new AppError(400, "Email is invalid"));
  }
  const user = await User.create({
    name,
    age,
    username,
    email,
    password,
  });
  res.status(201).json({
    status: "success",
    data: user,
  });
});
