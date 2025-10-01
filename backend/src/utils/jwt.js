const jwt = require('jsonwebtoken');
const env = require('../config/env');

const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    env.jwt.secret,
    { expiresIn: env.jwt.expiration }
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    env.jwt.refreshSecret,
    { expiresIn: env.jwt.refreshExpiration }
  );
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, env.jwt.secret);
  } catch (error) {
    return null;
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, env.jwt.refreshSecret);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};
