const jwt = require('jsonwebtoken');

const createCookie = (res, name, data, maxAge) => {
  res.cookie(name, data, { 
    maxAge: maxAge, 
    httpOnly: true,
    secure: true
  });
};

const makePayload = (user, csrfToken) => {
  return {
    sub: user.id,
    googleId: user.googleId,
    name: user.email,
    iat: Date.now(),
    csrfToken
  };
};

const createToken = (payload, tokenKey, expiration) => {
  const options = {
    expiresIn: expiration
  };
  return jwt.sign(payload, tokenKey, options);
};

module.exports = {
  createToken,
  makePayload,
  createCookie
}