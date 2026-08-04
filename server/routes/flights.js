const express = require("express");
const { getAllFlights } = require("../controllers/flightsController");

const router = express.Router();

// Get all flights
router.get("/", getAllFlights);

module.exports = router;
