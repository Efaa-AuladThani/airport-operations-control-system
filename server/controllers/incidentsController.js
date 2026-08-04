const pool = require("../config/db");

// Fetch all incidents with their linked flight number
async function getAllIncidents(req, res) {
  try {
    const result = await pool.query(`
      SELECT i.id, i.flight_id, i.title, i.description, i.severity, i.status, i.reported_at, i.resolved_at, i.created_at,
             f.flight_number
      FROM incidents AS i
      JOIN flights AS f ON i.flight_id = f.id
      ORDER BY i.reported_at DESC;
    `);

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching incidents:", error.message);
    return res.status(500).json({ error: "Failed to fetch incidents" });
  }
}

// Create a new incident record
async function createIncident(req, res) {
  const { flight_id, title, description, severity, status } = req.body;

  // Validate required fields
  if (!flight_id || !title || !description || !severity || !status) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await pool.query(
      `
        INSERT INTO incidents (flight_id, title, description, severity, status, reported_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING *;
      `,
      [flight_id, title, description, severity, status]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating incident:", error);
    return res.status(500).json({ error: "Failed to create incident" });
  }
}

// Update an existing incident record
async function updateIncident(req, res) {
  const { id } = req.params;
  const { title, description, severity, status } = req.body;

  // Validate required fields
  if (!title || !description || !severity || !status) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await pool.query(
      `
        UPDATE incidents
        SET title = $1, description = $2, severity = $3, status = $4
        WHERE id = $5
        RETURNING *;
      `,
      [title, description, severity, status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Incident not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating incident:", error);
    return res.status(500).json({ error: "Failed to update incident" });
  }
}

// Delete an incident record
async function deleteIncident(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
        DELETE FROM incidents
        WHERE id = $1
        RETURNING *;
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Incident not found" });
    }

    return res.status(200).json({
      message: "Incident deleted successfully",
      incident: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting incident:", error);
    return res.status(500).json({ error: "Failed to delete incident" });
  }
}

module.exports = {
  getAllIncidents,
  createIncident,
  updateIncident,
  deleteIncident,
};
