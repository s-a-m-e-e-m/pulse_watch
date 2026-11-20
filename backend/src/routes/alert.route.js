const express = require("express");
const router = express.Router();

const { alertById, allAlerts, alertsByEndpointId } = require("../controllers/alert.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");

router.get("/", authMiddleware, allAlerts);
router.get("/endpoint/:endpointId", authMiddleware, alertsByEndpointId);
router.get("/:alertId", authMiddleware, alertById);

module.exports = router;