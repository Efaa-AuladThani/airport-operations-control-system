const test = require("node:test");
const assert = require("node:assert/strict");

const pool = require("../config/db");
const {
  createGate,
  updateGate,
  deleteGate,
} = require("../controllers/gatesController");

const baseGate = {
  id: 7,
  gate_number: "A12",
  terminal: "Terminal 1",
  status: "available",
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

test("createGate returns a created gate record", async () => {
  let lastQuery = null;
  pool.query = async (text, params) => {
    lastQuery = { text, params };
    return { rows: [baseGate] };
  };

  const req = {
    body: {
      gate_number: "A12",
      terminal: "Terminal 1",
      status: "available",
    },
  };
  const res = buildResponse();

  await createGate(req, res);

  assert.equal(res.statusCode, 201);
  assert.equal(res.body.gate_number, "A12");
  assert.match(lastQuery.text, /INSERT INTO gates/i);
});

test("updateGate returns updated gate record", async () => {
  let lastQuery = null;
  pool.query = async (text, params) => {
    lastQuery = { text, params };
    return {
      rowCount: 1,
      rows: [{ ...baseGate, status: "maintenance" }],
    };
  };

  const req = {
    params: { id: "7" },
    body: {
      gate_number: "A12",
      terminal: "Terminal 1",
      status: "maintenance",
    },
  };
  const res = buildResponse();

  await updateGate(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.status, "maintenance");
  assert.match(lastQuery.text, /UPDATE gates/i);
});

test("deleteGate removes the selected gate record", async () => {
  let lastQuery = null;
  pool.query = async (text, params) => {
    lastQuery = { text, params };
    return {
      rowCount: 1,
      rows: [baseGate],
    };
  };

  const req = { params: { id: "7" } };
  const res = buildResponse();

  await deleteGate(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.message, "Gate deleted successfully");
  assert.match(lastQuery.text, /DELETE FROM gates/i);
});
