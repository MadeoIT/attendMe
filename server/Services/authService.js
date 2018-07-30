const config = require('config');
const { saveTenant } = require('../Services/tenantService');
const { sendEmail, createEmailMessage } = require('../middleware/notification');
const { validateTenant } = require('../models/validationModels/tenantValidation');

const uuidv4 = require('uuid/v4');

const tokenKey = config.get('encryption.jwtSk');
const refreshTokenKey = config.get('encryption.jwtRefreshSk');
const confirmationTokenKey = config.get('encryption.jwtConfirmationSk');

const tokenExp = config.get('encryption.tokenExp');
const refreshTokenExp = config.get('encryption.refreshTokenExp');
const confirmationTokenExp = config.get('encryption.confirmationTokenExp');

const origin = config.get('origin');

const { createToken, makePayload } = require('../middleware/token');
const COOKIE_MAX_AGE = 14 * 24 * 60 * 60 * 1000; //Two weeks

const createCookie = (res, name, token) => {
  res.cookie(name, token, { 
    maxAge: COOKIE_MAX_AGE, 
    httpOnly: true,
    secure: true
  });
};

const sendConfirmationEmail = (user) => {
  const payload = makePayload(user);
  const confirmationToken = createToken(payload, confirmationTokenKey, confirmationTokenExp);
  const html = 
  `<h1>Please click on the link to confirm your email</h1>
  <a href="${origin}/api/auth/confirm/${confirmationToken}">Confirm your email</a>
  `;
  const message = createEmailMessage('todo@confirmation.com', user.email, 'Confirmation email', html);
  return sendEmail(message);
};

const signUp = async (req, res, next) => {
  try {
    validateTenant(req.body, res);
    const tenant = await saveTenant(req.body);
    if(!tenant) return res.status(400).send('Email already exist');
    
    sendConfirmationEmail(tenant); //Send email asyncronously
    res.status(200).send(tenant);

  } catch (error) {
    next(error);
  }
};

const confirmEmail = async (req, res, next) => {
  try {
    //verify token
    return;
  } catch (error) {
    
  }
}

const logIn = (req, res) => {
  const { user } = req;
  const csrfToken = uuidv4();
  const payload = makePayload(user, csrfToken);
  const token = createToken(payload, tokenKey, tokenExp);
  const refreshToken = createToken(payload, refreshTokenKey, refreshTokenExp);
  
  createCookie(res, 'token', token);
  createCookie(res, 'refresh-token', refreshToken);

  res.status(200).send({csrfToken});
};

const reLogIn = (req, res) => {
  const { user } = req;
  const csrfToken = uuidv4();
  const payload = makePayload(user, csrfToken);
  const token = createToken(payload, tokenKey, tokenExp);

  createCookie(res, 'token', token)

  res.status(200).send({csrfToken});
}

module.exports = {
  signUp,
  confirmEmail,
  logIn,
  reLogIn
}