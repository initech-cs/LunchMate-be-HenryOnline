const User = require("../models/user");
const { catchAsync, AppError } = require("../utils/appError");

exports.loginWithEmail = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError(400, "Email and password are required"));
  }
  const user = await User.loginWithEmail(email, password);
  if (!user) {
    return next(new AppError(403, "Unauthorized. Wrong email or password!"));
  }
  const token = await user.generateToken();
  res.status(200).json({
    status: "ok",
    data: {
      user,
      token,
    },
  });
});

exports.logoutUser = catchAsync(async (req, res, next) => {
  const user = await User.find(req.user._id);
});
