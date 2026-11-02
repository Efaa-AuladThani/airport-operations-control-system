const test = require("node:test");
const assert = require("node:assert/strict");

process.env.JWT_SECRET = "super-secret";

const pool = require("../config/db");
const {
  createFlight,
  updateFlight,
  deleteFlight,
} = require("../controllers/flightsController");

const baseFlight = {
  id: 42,
  flight_number: "AA101",
  airline: "American Airlines",
  aircraft_type: "A321",
  origin: "JFK",
  destination: "LAX",
  scheduled_time: "2026-09-14T14:00:00.000Z",
  status: "scheduled",
  gate_id: 2,
};

function buildResponse() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

test("createFlight returns a created flight record", async () => {
  let lastQuery = null;
  pool.query = async (text, params) => {
    lastQuery = { text, params };
    return { rows: [baseFlight] };
  };

  const req = {
    body: {
      flight_number: "AA101",
      airline: "American Airlines",
      aircraft_type: "A321",
      origin: "JFK",
      destination: "LAX",
      scheduled_time: "2026-09-14T14:00:00.000Z",
      status: "scheduled",
      gate_id: 2,
    },
  };
  const res = buildResponse();

  await createFlight(req, res);

  assert.equal(res.statusCode, 201);
  assert.equal(res.body.flight_number, "AA101");
  assert.match(lastQuery.text, /INSERT INTO flights/i);
});

test("updateFlight returns updated flight record", async () => {
  let lastQuery = null;
  pool.query = async (text, params) => {
    lastQuery = { text, params };
    return {
      rowCount: 1,
      rows: [{ ...baseFlight, status: "delayed" }],
    };
  };

  const req = {
    params: { id: "42" },
    body: {
      flight_number: "AA101",
      airline: "American Airlines",
      aircraft_type: "A321",
      origin: "JFK",
      destination: "LAX",
      scheduled_time: "2026-09-14T14:00:00.000Z",
      status: "delayed",
      gate_id: 2,
    },
  };
  const res = buildResponse();

  await updateFlight(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.status, "delayed");
  assert.match(lastQuery.text, /UPDATE flights/i);
});

test("deleteFlight removes the selected flight record", async () => {
  let lastQuery = null;
  pool.query = async (text, params) => {
    lastQuery = { text, params };
    return {
      rowCount: 1,
      rows: [baseFlight],
    };
  };

  const req = { params: { id: "42" } };
  const res = buildResponse();

  await deleteFlight(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.message, "Flight deleted successfully");
  assert.match(lastQuery.text, /DELETE FROM flights/i);
});
