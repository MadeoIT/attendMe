const R = require('ramda');
const jwt = require('jsonwebtoken');

const createCookie = (res, name, data, maxAge) => {
  res.cookie(name, data, { 
    maxAge: maxAge, 
    httpOnly: true,
    secure: true
  });
};

const createPayload = R.curry(
  (user, csrfToken) => {
    return {
      id: user.id,
      googleId: user.googleId,
      email: user.email,
      iat: Date.now(),
      csrfToken
    };
  }
);

const createToken = R.curry(
  (payload, tokenKey, expiration) => {
    const options = {
      expiresIn: expiration
    };
    return jwt.sign(payload, tokenKey, options);
  }
);

module.exports = {
  createToken,
  createPayload,
  createCookie
}