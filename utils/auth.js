const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Extract token from header
const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return null;
};

// Generate random token for email verification, etc.
const generateRandomToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Hash token
const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

module.exports = {
  generateToken,
  verifyToken,
  getTokenFromHeader,
  generateRandomToken,
  hashToken
};