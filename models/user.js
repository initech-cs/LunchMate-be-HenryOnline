const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const round = 10;
const jwt = require("jsonwebtoken");

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
      min: 18,
      max: 99,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    tags: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Tag",
        required: true,
      },
    ],
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      maxlength: 1024,
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
  //delete obj.password;
  //delete obj.tokens;
  return obj;
};

schema.methods.generateToken = async function () {
  const token = jwt.sign(
    {
      _id: this._id,
    },
    process.env.SECRET,
    { expiresIn: "1d" }
  );
  this.tokens.push(token);
  await this.save();
  return token;
};

schema.statics.loginWithEmail = async function (email, password) {
  const user = await this.findOne({ email }).populate("tags");
  if (!user) {
    return null;
  }
  const match = await bcrypt.compare(password, user.password);
  if (match) {
    return user;
  }
  return null;
};

schema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, round);
  }
  next();
});

module.exports = mongoose.model("User", schema);
