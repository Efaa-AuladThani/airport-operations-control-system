const express = require("express");
const { getAllIncidents, createIncident, updateIncident, deleteIncident } = require("../controllers/incidentsController");
const authenticateToken = require("../middleware/authMiddleware");
const router = express.Router();

// Get all incidents
router.get("/", getAllIncidents);

router.post("/", authenticateToken, createIncident);

router.put("/:id", authenticateToken, updateIncident);

router.delete("/:id", authenticateToken, deleteIncident);

module.exports = router;
