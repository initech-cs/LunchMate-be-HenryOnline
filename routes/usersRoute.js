var express = require("express");
var router = express.Router();
var { getAllUser, updateUser } = require("../controllers/userController");

router.route("/").get(getAllUser);

router.route("/update").put(updateUser);

module.exports = router;
