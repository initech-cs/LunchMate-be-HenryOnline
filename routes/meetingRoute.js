var express = require("express");
var router = express.Router();
const { createNewMeeting } = require("../controllers/meetingController");

router.route("/new").post(createNewMeeting);

module.exports = router;
