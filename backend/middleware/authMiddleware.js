const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables from .env file

/**
 * Middleware to authenticate JWT tokens.
 * Checks for a valid JWT in the Authorization header and verifies it.
 * Attaches the decoded user payload to `req.user` if valid.
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  // Check for the "Bearer TOKEN" format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('Access denied: No token provided.');
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user payload to the request for use in routes
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Invalid or expired token:', err.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
}

module.exports = authenticateToken;
