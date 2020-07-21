const User = require("../models/user");
const Tag = require("../models/tag");
const { catchAsync, AppError } = require("../utils/appError");

exports.createUser = catchAsync(async (req, res, next) => {
  const { name, age, tags, email, password } = req.body;
  const newTags = await Tag.convertToObject(tags);
  const user = await User.create({
    name,
    age,
    email,
    tags: newTags,
    password,
  });
  res.status(201).json({
    status: "success",
    data: user,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  console.log(req.user);
  const user = await User.findById(req.user._id);
  const fields = Object.keys(req.body);
  fields.map(async (field) => {
    if (field == "tags") {
      const newTags = await Tag.convertToObject(req.body[field]);
      return (user[field] = newTags);
    }
    return (user[field] = req.body[field]);
  });
  user.save();
  res.status(201).json({
    status: "success",
    data: user,
  });
});

exports.getAllUser = catchAsync(async (req, res, next) => {
  const user = await User.find();
  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.getProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("tags");
  res.status(200).json({
    status: "success",
    data: user,
  });
});
