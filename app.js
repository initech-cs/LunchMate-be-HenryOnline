var express = require("express");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

const { errorController } = require("./controllers/errorController");
require("dotenv").config();

var app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use(errorController);

module.exports = app;
