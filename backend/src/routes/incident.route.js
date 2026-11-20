const express = require("express");
const router = express.Router();

const { allIncidents, incidentById, IncidentByEndpointId } = require("../controllers/incident.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");

router.get("/", authMiddleware, allIncidents);
router.get("/endpoint/:endpointId", authMiddleware, IncidentByEndpointId);
router.get("/:incidentId", authMiddleware, incidentById);

module.exports = router;