var express = require("express");
var router = express.Router();
var {
  getAllUser,
  updateUser,
  getProfile,
} = require("../controllers/userController");

router.route("/").get(getAllUser);

router.route("/me").get(getProfile);

router.route("/update").put(updateUser);

module.exports = router;
