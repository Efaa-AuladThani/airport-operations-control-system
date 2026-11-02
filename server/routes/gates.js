const express = require("express");
const {
  getAllGates,
  getGateById,
  createGate,
  updateGate,
  deleteGate,
} = require("../controllers/gatesController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Get all gates
router.get("/", getAllGates);

// Get a single gate by id
router.get("/:id", getGateById);

// Create a new gate
router.post("/", authenticateToken, createGate);

// Update an existing gate
router.put("/:id", authenticateToken, updateGate);

// Delete a gate
router.delete("/:id", authenticateToken, deleteGate);

module.exports = router;
