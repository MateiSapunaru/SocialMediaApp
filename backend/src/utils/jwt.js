const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRES } = require('../config/env');

function generateAccessToken(user, roles) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      username: user.username,
      roles
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES }
  );
}

function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
}

module.exports = {
  generateAccessToken,
  verifyAccessToken
};
