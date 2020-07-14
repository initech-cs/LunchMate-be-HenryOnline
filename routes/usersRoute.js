var express = require("express");
var router = express.Router();
var { createUser } = require("../controllers/userController");

router.route("/signup").post(createUser);

module.exports = router;
