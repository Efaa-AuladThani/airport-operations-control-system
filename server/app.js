const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");


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

// Any request beginning with /api/auth, /api/flights, /api/gates, or /api/incidents should be handled by their respective routers


app.use("/api/auth", authRoutes);

const flightsRoutes = require("./routes/flights");

app.use("/api/flights", flightsRoutes);

const gatesRoutes = require("./routes/gates");

app.use("/api/gates", gatesRoutes);

const incidentsRoutes = require("./routes/incidents");

app.use("/api/incidents", incidentsRoutes);


// Export the configured app for use by the server entry file
module.exports = app;
