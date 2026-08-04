const express = require("express");
const { login } = require("../controllers/authController");

// Create a router instance for authentication-related endpoints.
const router = express.Router();

// Register the login endpoint that authenticates a user and issues a JWT.
router.post("/login", login);

// Export the router so it can be mounted by the main Express app.
module.exports = router;
