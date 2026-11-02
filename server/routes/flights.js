const express = require("express");
const {
  getAllFlights,
  getFlightById,
  createFlight,
  updateFlight,
  deleteFlight,
} = require("../controllers/flightsController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Get all flights
router.get("/", getAllFlights);

// Get a single flight by id
router.get("/:id", getFlightById);

// Create a new flight
router.post("/", authenticateToken, createFlight);

// Update an existing flight
router.put("/:id", authenticateToken, updateFlight);

// Delete a flight
router.delete("/:id", authenticateToken, deleteFlight);

module.exports = router;
