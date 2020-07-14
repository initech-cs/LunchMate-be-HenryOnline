const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const round = 10;
const jwt = require("jsonwebtoken");
const { AppError } = require("../utils/appError");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    username: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
      minlength: 5,
      maxlength: 12,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      maxlength: 12,
    },
    tokens: [String],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

schema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.tokens;
  return obj;
};

schema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, round);
  }
  next();
});

module.exports = mongoose.model("User", schema);
