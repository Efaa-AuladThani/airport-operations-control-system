const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// Handle user authentication and issue a JWT on successful login.
async function login(req, res) {
  // Read the submitted email and password from the request body.
  const { email, password } = req.body || {};

  // Validate that both required fields were provided.
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Query the database for the user matching the provided email.
    const result = await pool.query(
      "SELECT id, full_name, email, role, password_hash FROM users WHERE email = $1",
      [email]
    );

    const user = result.rows[0];

    // Return a generic auth error if the user does not exist.
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the submitted password with the stored bcrypt hash.
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    // Return a generic auth error if the password does not match.
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured.");
    }

    // Create a JWT containing the user's identifying information.
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Return the signed token and a safe view of the user profile.
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    // Handle unexpected database or authentication errors.
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  login
};
