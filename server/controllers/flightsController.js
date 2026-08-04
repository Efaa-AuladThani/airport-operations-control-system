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

module.exports = {
  getAllFlights,
};
