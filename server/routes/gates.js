const express = require("express");
const { getAllGates } = require("../controllers/gatesController");

const router = express.Router();

// Get all gates
router.get("/", getAllGates);

module.exports = router;
