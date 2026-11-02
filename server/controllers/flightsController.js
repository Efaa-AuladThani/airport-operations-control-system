const pool = require("../config/db");

// Fetch all flights from the database
async function getAllFlights(req, res) {
  try {
    const result = await pool.query(
      "SELECT * FROM flights ORDER BY scheduled_time ASC;"
    );

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching flights:", error.message);
    return res.status(500).json({ error: "Failed to fetch flights" });
  }
}

async function getFlightById(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM flights WHERE id = $1;",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Flight not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching flight:", error.message);
    return res.status(500).json({ error: "Failed to fetch flight" });
  }
}

// Create a new flight record
async function createFlight(req, res) {
  const {
    flight_number,
    airline,
    aircraft_type,
    origin,
    destination,
    scheduled_time,
    status,
    gate_id,
  } = req.body;

  if (!flight_number || !airline || !origin || !destination || !scheduled_time || !status) {
    return res.status(400).json({ error: "All required flight fields are required" });
  }

  const normalizedFlightNumber = String(flight_number).trim();
  const normalizedAirline = String(airline).trim();
  const normalizedOrigin = String(origin).trim().toUpperCase();
  const normalizedDestination = String(destination).trim().toUpperCase();
  const normalizedStatus = String(status).trim();
  const normalizedGateId = gate_id === "" || gate_id === null || gate_id === undefined ? null : Number(gate_id);

  try {
    const result = await pool.query(
      `
        INSERT INTO flights (
          flight_number,
          airline,
          aircraft_type,
          origin,
          destination,
          scheduled_time,
          status,
          gate_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
      `,
      [
        normalizedFlightNumber,
        normalizedAirline,
        aircraft_type ? String(aircraft_type).trim() : null,
        normalizedOrigin,
        normalizedDestination,
        new Date(scheduled_time).toISOString(),
        normalizedStatus,
        normalizedGateId,
      ]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating flight:", error);
    return res.status(500).json({ error: "Failed to create flight" });
  }
}

// Update an existing flight record
async function updateFlight(req, res) {
  const { id } = req.params;
  const {
    flight_number,
    airline,
    aircraft_type,
    origin,
    destination,
    scheduled_time,
    status,
    gate_id,
  } = req.body;

  if (!flight_number || !airline || !origin || !destination || !scheduled_time || !status) {
    return res.status(400).json({ error: "All required flight fields are required" });
  }

  const normalizedFlightNumber = String(flight_number).trim();
  const normalizedAirline = String(airline).trim();
  const normalizedOrigin = String(origin).trim().toUpperCase();
  const normalizedDestination = String(destination).trim().toUpperCase();
  const normalizedStatus = String(status).trim();
  const normalizedGateId = gate_id === "" || gate_id === null || gate_id === undefined ? null : Number(gate_id);

  try {
    const result = await pool.query(
      `
        UPDATE flights
        SET flight_number = $1,
            airline = $2,
            aircraft_type = $3,
            origin = $4,
            destination = $5,
            scheduled_time = $6,
            status = $7,
            gate_id = $8
        WHERE id = $9
        RETURNING *;
      `,
      [
        normalizedFlightNumber,
        normalizedAirline,
        aircraft_type ? String(aircraft_type).trim() : null,
        normalizedOrigin,
        normalizedDestination,
        new Date(scheduled_time).toISOString(),
        normalizedStatus,
        normalizedGateId,
        id,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Flight not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating flight:", error);
    return res.status(500).json({ error: "Failed to update flight" });
  }
}

// Delete a flight record
async function deleteFlight(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
        DELETE FROM flights
        WHERE id = $1
        RETURNING *;
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Flight not found" });
    }

    return res.status(200).json({
      message: "Flight deleted successfully",
      flight: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting flight:", error);
    return res.status(500).json({ error: "Failed to delete flight" });
  }
}

module.exports = {
  getAllFlights,
  getFlightById,
  createFlight,
  updateFlight,
  deleteFlight,
};
