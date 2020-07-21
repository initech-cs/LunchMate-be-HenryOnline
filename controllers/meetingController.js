const User = require("../models/user");
const Meeting = require("../models/meeting");
const { catchAsync, AppError } = require("../utils/appError");

exports.createNewMeeting = catchAsync(async (req, res, next) => {
  const user = User.findById(req.user._id);
  const { location, dateAndTime } = req.body;
  if (!location || !dateAndTime) {
    return next(new AppError(400, "Missing fields"));
  }
  const meeting = await Meeting.create({
    user: req.user._id,
    location,
    dateAndTime,
  });
  res.status(201).json({
    status: "success",
    data: meeting,
  });
});
