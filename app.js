var express = require("express");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/indexRoute");
var usersRouter = require("./routes/usersRoute");
var authRouter = require("./routes/authRoute");

const mongoose = require("mongoose");
const { errorController } = require("./controllers/errorController");
const { verifyToken } = require("./middleware/verifyToken");
require("dotenv").config();

var app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const databaseUrl =
  process.env.NODE_ENV == "development"
    ? process.env.DB_LOCAL
    : process.env.DB_ONLINE;

mongoose
  .connect(databaseUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to database"));

app.use("/", indexRouter);
app.use("/users", verifyToken, usersRouter);
app.use("/auth", authRouter);

app.use(errorController);

module.exports = app;
