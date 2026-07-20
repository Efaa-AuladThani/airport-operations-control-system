const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from the .env file
dotenv.config();

// Create the Express app
const app = express();

// Enable cross-origin requests from the frontend
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Airport Operations Control System API",
    version: "1.0.0"
  });
});

// Export the configured app for use by the server entry file
module.exports = app;
