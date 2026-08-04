const jwt = require("jsonwebtoken");

// Middleware to authenticate requests using a JWT from the Authorization header
function authenticateToken(req, res, next) {
  // Read the Authorization header from the incoming request
  const authHeader = req.headers.authorization;

  // Ensure the header exists and uses the Bearer scheme
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access token is required" });
  }

  // Extract the token from the header value
  const token = authHeader.split(" ")[1];

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
        error: "JWT secret is not configured."
    });
}

  // Verify the token with the secret from the environment variables
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Attach the decoded payload to the request and continue to the next handler
    req.user = decoded;
    next();
  });
}

module.exports = authenticateToken;
