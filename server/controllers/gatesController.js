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

module.exports = {
  getAllGates,
};
