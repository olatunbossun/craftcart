const jwt = require('jsonwebtoken');

const verifyToken = (token) => {
  try {
    if (!token) return null;
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error('Token verification error:', err.message);
    return null;
  }
};

const createToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });
};

module.exports = {
  verifyToken,
  createToken
};