const config = require('config');
const uuidv4 = require('uuid/v4');

const tokenKey = config.get('encryption.jwtSk');
const refreshTokenKey = config.get('encryption.jwtRefreshSk');

const tokenExp = config.get('encryption.tokenExp');
const refreshTokenExp = config.get('encryption.refreshTokenExp');

const { createToken, makePayload } = require('../middleware/token');
const COOKIE_MAX_AGE = 14 * 24 * 60 * 60 * 1000; //Two weeks

const createCookie = (res, name, token) => {
  res.cookie(name, token, { 
    maxAge: COOKIE_MAX_AGE, 
    httpOnly: true,
    secure: true
  });
};

const sendTokenAndRefreshToken = (req, res) => {
  const { user } = req;
  const csrfToken = uuidv4();
  const payload = makePayload(user, csrfToken);
  const token = createToken(payload, tokenKey, tokenExp);
  const refreshToken = createToken(payload, refreshTokenKey, refreshTokenExp);
  
  createCookie(res, 'token', token);
  createCookie(res, 'refresh-token', refreshToken);

  res.status(200).send({csrfToken});
};

//TODO: maybe csrfToken does not need to be refreshed
const sendToken = (req, res) => {
  const { user } = req;
  const csrfToken = uuidv4();
  const payload = makePayload(user, csrfToken);
  const token = createToken(payload, tokenKey, tokenExp);

  createCookie(res, 'token', token)

  res.status(200).send({csrfToken});
}

module.exports = {
  sendTokenAndRefreshToken,
  sendToken
}