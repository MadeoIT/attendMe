const config = require('config');
const uuidv4 = require('uuid/v4');
const R = require('ramda');

//Functions
const { updateTenant, saveTenant } = require('../Services/tenantService');
const { 
  createEmailMessage, createTokenizedUrl, htmlResetPassword,
  htmlResetPasswordConfirm, htmlWelcome, htmlConfirmEmail
} = require('../middleware/messages');
const { sendNotification } = require('../middleware/notification');
const { createToken, createPayload, createCookie } = require('../middleware/token');
const { generateSalt, hashPassword } = require('../middleware/encryption');

//Config constants
const tokenKey = config.get('encryption.jwtSk');
const refreshTokenKey = config.get('encryption.jwtRefreshSk');
const tokenExp = config.get('encryption.tokenExp');
const refreshTokenExp = config.get('encryption.refreshTokenExp');
const confirmationTokenExp = config.get('encryption.confirmationTokenExp');
const confirmationTokenKey = config.get('encryption.jwtConfirmationSk');
const COOKIE_MAX_AGE = 14 * 24 * 60 * 60 * 1000; //Two weeks

const _ = R.__; //ramda placeholder for curried function

const rawUrl = R.pipe(
  createPayload(_, ''), 
  createToken(_, confirmationTokenKey, confirmationTokenExp), 
  createTokenizedUrl
);

const resetPassowrd = async (req, res, next) => {
  try {
    const { user } = req;
    const { password } = req.body;

    const hashedPassword = await R.pipeP(
      generateSalt, 
      hashPassword(password)
    )();
    
    const tenant = await updateTenant({password: hashedPassword}, user.id);
    
    const message = createEmailMessage(
      'password-reset@todo.com', 
      tenant.email,
      'Rest password',  
      htmlResetPasswordConfirm(tenant)
    );
    await sendNotification('email')(message);
   
    res.status(200).send(tenant);

  } catch (error) {
    next(error);
  }
};

const mailPasswordReset = async (req, res, next) => {
  try {
    const { user } = req;

    const url = rawUrl(user)('auth/password');
    
    const message = createEmailMessage(
      'password-reset@todo.com', 
      user.email,
      'Rest password',  
      htmlResetPassword(url)
    );
    await sendNotification('email')(message);
    
    res.status(200).send(user);

  } catch (error) {
    next(error);
  }
};

const signup = async (req, res, next) => {
  try {
    const { body } = req;
    
    const hashedPassword = await R.pipeP(
      generateSalt, 
      hashPassword(body.password)
    )();

    const tenantObj = R.merge(body, { password: hashedPassword });
    const tenant = await saveTenant(tenantObj);

    if(!tenant.result && tenant.message) {
      return res.status(400).send(tenant.message);
    };

    const url = rawUrl(tenant)('auth/confirm');

    const message = createEmailMessage(
      'confirm@todo.com', 
      tenant.email,
      'Confirm email',  
      htmlConfirmEmail(url)
    );
    await sendNotification('email')(message);

    res.status(200).send(tenant);

  } catch (error) {
    next(error);
  }
};

const confirmAccount = async (req, res, next) => {
  try {
    const { user } = req;

    const tenant = await updateTenant({confirmed: true}, user.id);

    const message = createEmailMessage(
      'confirm@todo.com', 
      tenant.email,
      'Confirm email',  
      htmlWelcome(tenant)
    );
    await sendNotification('email')(message);

    res.status(200).send(tenant);

  } catch (error) {
    next(error);
  }
};

const sendTokenAndRefreshToken = (req, res) => {
  const { user } = req;
  const csrfToken = uuidv4();

  const rawToken = R.pipe(
    createPayload(_, csrfToken),
    createToken, 
  )(user);

  const token = rawToken(tokenKey, tokenExp);
  const refreshToken = rawToken(refreshTokenKey, refreshTokenExp);
  
  createCookie(res, 'token', token, COOKIE_MAX_AGE);
  createCookie(res, 'refresh-token', refreshToken, COOKIE_MAX_AGE);

  res.status(200).send({csrfToken, id: user.id});
};

//TODO: should also resend the refresh token
const sendToken = (req, res) => {
  const { user } = req;

  const token = R.pipe(
    createPayload(_, ''), 
    createToken(_, tokenKey, tokenExp), 
  )(user);

  createCookie(res, 'token', token, COOKIE_MAX_AGE);

  res.status(200).send({});
};

module.exports = {
  sendTokenAndRefreshToken,
  sendToken,
  resetPassowrd,
  mailPasswordReset,
  signup,
  confirmAccount
}