const R = require('ramda');
const jwt = require('jsonwebtoken');
const config = require('config');

const createCookie = (res, name, data, maxAge) => {
  res.cookie(name, data, {
    maxAge: maxAge,
    httpOnly: true,
    secure: config.get('cookie.secure'),
    overwrite: true
  });
};

const createPayload = R.curry(
  (user, csrfToken) => {
    return {
      id: user.id,
      googleId: user.googleId,
      email: user.email,
      iat: Math.floor(Date.now() / 1000),
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