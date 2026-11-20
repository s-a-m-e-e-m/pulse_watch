const express = require("express");
const router = express.Router();

const { createEndpoint, getEndpoints, getEndpointById, deleteEndpoint, updateEndpoint } = require("../controllers/endpoint.controller.js");

const authMiddleware = require("../middleware/auth.middleware.js");

router.post("/create", authMiddleware, createEndpoint);
router.get("/", authMiddleware, getEndpoints);
router.get("/:id", authMiddleware, getEndpointById);
router.put("/edit/:id", authMiddleware, updateEndpoint);
router.delete("/:id", authMiddleware, deleteEndpoint);

module.exports = router;