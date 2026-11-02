const pool = require("../config/db");

// Fetch all gates from the database
async function getAllGates(req, res) {
  try {
    const result = await pool.query(
      "SELECT * FROM gates ORDER BY gate_number ASC;"
    );

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching gates:", error.message);
    return res.status(500).json({ error: "Failed to fetch gates" });
  }
}

async function getGateById(req, res) {
  const { id } = req.params;

  if (!id || Number.isNaN(Number(id))) {
    return res.status(400).json({ error: "Valid gate id is required" });
  }

  try {
    const result = await pool.query("SELECT * FROM gates WHERE id = $1;", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Gate not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching gate:", error.message);
    return res.status(500).json({ error: "Failed to fetch gate" });
  }
}

// Create a new gate record
async function createGate(req, res) {
  const { gate_number, terminal, status } = req.body;

  if (!gate_number || !terminal) {
    return res.status(400).json({ error: "Gate number and terminal are required" });
  }

  const normalizedGateNumber = String(gate_number).trim();
  const normalizedTerminal = String(terminal).trim();
  const normalizedStatus =
    status === undefined || status === null || status === ""
      ? "available"
      : String(status).trim().toLowerCase();

  if (!["available", "occupied", "maintenance"].includes(normalizedStatus)) {
    return res.status(400).json({
      error: "Status must be one of: available, occupied, maintenance",
    });
  }

  try {
    const result = await pool.query(
      `
        INSERT INTO gates (gate_number, terminal, status)
        VALUES ($1, $2, $3)
        RETURNING *;
      `,
      [normalizedGateNumber, normalizedTerminal, normalizedStatus]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating gate:", error);

    if (error.code === "23505") {
      return res.status(409).json({ error: "Gate number already exists" });
    }

    return res.status(500).json({ error: "Failed to create gate" });
  }
}

// Update an existing gate record
async function updateGate(req, res) {
  const { id } = req.params;
  const { gate_number, terminal, status } = req.body;

  if (!id || Number.isNaN(Number(id))) {
    return res.status(400).json({ error: "Valid gate id is required" });
  }

  if (!gate_number || !terminal) {
    return res.status(400).json({ error: "Gate number and terminal are required" });
  }

  try {
    const existingGateResult = await pool.query(
      "SELECT * FROM gates WHERE id = $1;",
      [id]
    );

    if (existingGateResult.rowCount === 0) {
      return res.status(404).json({ error: "Gate not found" });
    }

    const currentGate = existingGateResult.rows[0];
    const normalizedGateNumber = String(gate_number).trim();
    const normalizedTerminal = String(terminal).trim();
    const normalizedStatus =
      status === undefined || status === null || status === ""
        ? currentGate.status
        : String(status).trim().toLowerCase();

    if (!["available", "occupied", "maintenance"].includes(normalizedStatus)) {
      return res.status(400).json({
        error: "Status must be one of: available, occupied, maintenance",
      });
    }

    const result = await pool.query(
      `
        UPDATE gates
        SET gate_number = $1,
            terminal = $2,
            status = $3
        WHERE id = $4
        RETURNING *;
      `,
      [normalizedGateNumber, normalizedTerminal, normalizedStatus, id]
    );

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating gate:", error);

    if (error.code === "23505") {
      return res.status(409).json({ error: "Gate number already exists" });
    }

    return res.status(500).json({ error: "Failed to update gate" });
  }
}

// Delete a gate record
async function deleteGate(req, res) {
  const { id } = req.params;

  if (!id || Number.isNaN(Number(id))) {
    return res.status(400).json({ error: "Valid gate id is required" });
  }

  try {
    const result = await pool.query(
      `
        DELETE FROM gates
        WHERE id = $1
        RETURNING *;
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Gate not found" });
    }

    return res.status(200).json({
      message: "Gate deleted successfully",
      gate: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting gate:", error);
    return res.status(500).json({ error: "Failed to delete gate" });
  }
}

module.exports = {
  getAllGates,
  getGateById,
  createGate,
  updateGate,
  deleteGate,
};
