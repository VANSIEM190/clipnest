const express = require("express");
const router = express.Router();
const sendFirebaseNotification = require("../controllers/firebaseController");

router.post("/send-notification", sendFirebaseNotification); // ✔ simple et propre

module.exports = router;
