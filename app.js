var express = require("express");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/indexRoute");
var usersRouter = require("./routes/usersRoute");

const mongoose = require("mongoose");
const { errorController } = require("./controllers/errorController");
require("dotenv").config();

var app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());

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
app.use("/users", usersRouter);

app.use(errorController);

module.exports = app;
