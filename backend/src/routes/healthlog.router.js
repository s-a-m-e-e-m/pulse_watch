const express = require("express");
const router = express.Router();

const { getHealthLogs } = require("../controllers/healthlog.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");

router.get("/:endpointId", authMiddleware, getHealthLogs);

module.exports = router;