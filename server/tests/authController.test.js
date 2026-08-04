const test = require("node:test");
const assert = require("node:assert/strict");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

process.env.JWT_SECRET = "super-secret";

const pool = require("../config/db");

let lastQuery;
pool.query = async (text, params) => {
  lastQuery = { text, params };
  return {
    rows: [
      {
        id: 1,
        full_name: "Test User",
        email: "test@example.com",
        role: "staff",
        password_hash: "$2b$10$7T6R7aZP8f3PsY/8f6YjUe2h8h9t2h2N6kgYkV6H0M0f2XoYfH2"
      }
    ]
  };
};

bcrypt.compare = async (candidatePassword, storedHash) => candidatePassword === "secret123";
jwt.sign = (payload, secret, options) => `signed:${payload.email}:${secret}:${options.expiresIn}`;

const { login } = require("../controllers/authController");

test("login returns a token and user details for valid credentials", async () => {
  const req = {
    body: {
      email: "test@example.com",
      password: "secret123"
    }
  };
  const res = {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };

  await login(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.token, "signed:test@example.com:super-secret:24h");
  assert.deepEqual(res.body.user, {
    id: 1,
    full_name: "Test User",
    email: "test@example.com",
    role: "staff"
  });
  assert.equal(lastQuery.text, "SELECT id, full_name, email, role, password_hash FROM users WHERE email = $1");
  assert.deepEqual(lastQuery.params, ["test@example.com"]);
});

test("login returns 401 for invalid password", async () => {
  const req = {
    body: {
      email: "test@example.com",
      password: "wrong-password"
    }
  };
  const res = {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };

  await login(req, res);

  assert.equal(res.statusCode, 401);
  assert.deepEqual(res.body, { message: "Invalid email or password" });
});
