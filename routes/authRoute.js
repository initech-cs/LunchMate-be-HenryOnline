var express = require("express");
var router = express.Router();
const { loginWithEmail, logoutUser } = require("../controllers/authController");
const { createUser } = require("../controllers/userController");
const { verifyToken } = require("../middleware/verifyToken");

router.route("/register").post(createUser);

router.route("/login").post(loginWithEmail);

router.route("/logout").put(verifyToken, logoutUser);

module.exports = router;
