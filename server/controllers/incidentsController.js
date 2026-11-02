const pool = require("../config/db");

const VALID_SEVERITIES = ["low", "medium", "high", "critical"];
const VALID_STATUSES = ["open", "investigating", "resolved", "closed"];

function parsePositiveInteger(value, fieldName) {
  if (value === undefined || value === null || String(value).trim() === "") {
    return { error: `${fieldName} is required` };
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    return { error: `${fieldName} must be a positive integer` };
  }

  return { value: parsedValue };
}

function normalizeEnumValue(value, fieldName, allowedValues) {
  if (value === undefined || value === null || String(value).trim() === "") {
    return { error: `${fieldName} is required` };
  }

  const normalizedValue = String(value).trim().toLowerCase();

  if (!allowedValues.includes(normalizedValue)) {
    return {
      error: `${fieldName} must be one of: ${allowedValues.join(", ")}`,
    };
  }

  return { value: normalizedValue };
}

function normalizeTextField(value, fieldName, maxLength = null) {
  if (value === undefined || value === null || String(value).trim() === "") {
    return { error: `${fieldName} is required` };
  }

  const normalizedValue = String(value).trim();

  if (maxLength && normalizedValue.length > maxLength) {
    return { error: `${fieldName} must be ${maxLength} characters or fewer` };
  }

  return { value: normalizedValue };
}

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

  const flightIdCheck = parsePositiveInteger(flight_id, "flight_id");
  if (flightIdCheck.error) {
    return res.status(400).json({ error: flightIdCheck.error });
  }

  const titleCheck = normalizeTextField(title, "title", 150);
  if (titleCheck.error) {
    return res.status(400).json({ error: titleCheck.error });
  }

  const descriptionCheck = normalizeTextField(description, "description");
  if (descriptionCheck.error) {
    return res.status(400).json({ error: descriptionCheck.error });
  }

  const severityCheck = normalizeEnumValue(severity, "severity", VALID_SEVERITIES);
  if (severityCheck.error) {
    return res.status(400).json({ error: severityCheck.error });
  }

  const statusCheck = normalizeEnumValue(status, "status", VALID_STATUSES);
  if (statusCheck.error) {
    return res.status(400).json({ error: statusCheck.error });
  }

  try {
    const flightResult = await pool.query(
      "SELECT id FROM flights WHERE id = $1;",
      [flightIdCheck.value]
    );

    if (flightResult.rowCount === 0) {
      return res.status(404).json({ error: "Flight not found" });
    }

    const resolvedAt = ["resolved", "closed"].includes(statusCheck.value)
      ? new Date().toISOString()
      : null;

    const result = await pool.query(
      `
        INSERT INTO incidents (flight_id, title, description, severity, status, resolved_at, reported_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        RETURNING *;
      `,
      [
        flightIdCheck.value,
        titleCheck.value,
        descriptionCheck.value,
        severityCheck.value,
        statusCheck.value,
        resolvedAt,
      ]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating incident:", error);

    if (error.code === "23505") {
      return res.status(409).json({ error: "Incident already exists" });
    }

    return res.status(500).json({ error: "Failed to create incident" });
  }
}

// Update an existing incident record
async function updateIncident(req, res) {
  const { id } = req.params;
  const body = req.body || {};
  const { title, description, severity, status } = body;

  const idCheck = parsePositiveInteger(id, "id");
  if (idCheck.error) {
    return res.status(400).json({ error: idCheck.error });
  }

  if (title === undefined && description === undefined && severity === undefined && status === undefined) {
    return res.status(400).json({ error: "At least one incident field is required" });
  }

  try {
    const existingIncident = await pool.query(
      "SELECT * FROM incidents WHERE id = $1;",
      [idCheck.value]
    );

    if (existingIncident.rowCount === 0) {
      return res.status(404).json({ error: "Incident not found" });
    }

    const currentIncident = existingIncident.rows[0];
    const isCurrentlyResolved = ["resolved", "closed"].includes(currentIncident.status);
    const isNewStatusResolved =
      status !== undefined && status !== null && String(status).trim() !== "" && ["resolved", "closed"].includes(String(status).trim().toLowerCase());

    const finalTitle =
      title === undefined || title === null || String(title).trim() === ""
        ? currentIncident.title
        : normalizeTextField(title, "title", 150);

    if (finalTitle && finalTitle.error) {
      return res.status(400).json({ error: finalTitle.error });
    }

    const finalDescription =
      description === undefined || description === null || String(description).trim() === ""
        ? currentIncident.description
        : normalizeTextField(description, "description");

    if (finalDescription && finalDescription.error) {
      return res.status(400).json({ error: finalDescription.error });
    }

    const finalSeverity =
      severity === undefined || severity === null || String(severity).trim() === ""
        ? currentIncident.severity
        : normalizeEnumValue(severity, "severity", VALID_SEVERITIES);

    if (finalSeverity && finalSeverity.error) {
      return res.status(400).json({ error: finalSeverity.error });
    }

    const finalStatus =
      status === undefined || status === null || String(status).trim() === ""
        ? currentIncident.status
        : normalizeEnumValue(status, "status", VALID_STATUSES);

    if (finalStatus && finalStatus.error) {
      return res.status(400).json({ error: finalStatus.error });
    }

    let resolvedAt = currentIncident.resolved_at;

    if (
      status !== undefined &&
      status !== null &&
      String(status).trim() !== "" &&
      ["resolved", "closed"].includes(String(status).trim().toLowerCase())
    ) {
      if (!isCurrentlyResolved) {
        resolvedAt = new Date().toISOString();
      }
    } else if (
      status !== undefined &&
      status !== null &&
      String(status).trim() !== "" &&
      ["open", "investigating"].includes(String(status).trim().toLowerCase())
    ) {
      resolvedAt = null;
    }

    const result = await pool.query(
      `
        UPDATE incidents
        SET title = $1,
            description = $2,
            severity = $3,
            status = $4,
            resolved_at = $5
        WHERE id = $6
        RETURNING *;
      `,
      [
        finalTitle.value || finalTitle || currentIncident.title,
        finalDescription.value || finalDescription || currentIncident.description,
        finalSeverity.value || finalSeverity || currentIncident.severity,
        finalStatus.value || finalStatus || currentIncident.status,
        resolvedAt,
        idCheck.value,
      ]
    );

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating incident:", error);

    if (error.code === "23505") {
      return res.status(409).json({ error: "Incident already exists" });
    }

    return res.status(500).json({ error: "Failed to update incident" });
  }
}

// Delete an incident record
async function deleteIncident(req, res) {
  const { id } = req.params;
  const idCheck = parsePositiveInteger(id, "id");

  if (idCheck.error) {
    return res.status(400).json({ error: idCheck.error });
  }

  try {
    const result = await pool.query(
      `
        DELETE FROM incidents
        WHERE id = $1
        RETURNING *;
      `,
      [idCheck.value]
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
