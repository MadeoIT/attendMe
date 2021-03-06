const config = require('config');
const uuidv4 = require('uuid/v4');
const R = require('ramda');

//Functions
const { updateTenant, saveTenant } = require('../Services/tenantService');
const { 
  createEmailMessage, createTokenizedUrl, htmlResetPassword,
  htmlResetPasswordConfirm, htmlWelcome, htmlConfirmEmail
} = require('../utils/messages');
const { sendNotification } = require('../middleware/notification');
const { createToken, createPayload, createCookie } = require('../utils/token');
const identityDAO = require('../DAOs/identityDAO');

//Config constants
const tokenKey = config.get('encryption.jwtSk');
const refreshTokenKey = config.get('encryption.jwtRefreshSk');
const tokenExp = config.get('encryption.tokenExp');
const refreshTokenExp = config.get('encryption.refreshTokenExp');
const confirmationTokenExp = config.get('encryption.confirmationTokenExp');
const confirmationTokenKey = config.get('encryption.jwtConfirmationSk');
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; //One week

const _ = R.__; //ramda placeholder for curried function

const rawUrl = R.pipe(
  createPayload(_, ''), 
  createToken(_, confirmationTokenKey, confirmationTokenExp), 
  createTokenizedUrl
);

const signup = async (req, res, next) => {
  try {
    const { body } = req;
    
    const tenant = await saveTenant(body);
    
    const url = rawUrl(tenant)('signup/confirm');
   
    const message = createEmailMessage(
      'confirm@todo.com', 
      tenant.email,
      'Confirm email',  
      htmlConfirmEmail(url)
    );
    await sendNotification('email')(message);

    res.status(200).send(tenant);

  } catch (error) {
    
    if(!error.status === 400) {
      return res.status(400).send(error.message);
    };

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

const signupGoogle = async (req, res, next) => {
  try {
    const { id, emails } = req.user;
    const email = emails[0].value;
    
    const foundIdentity = await identityDAO.findIdentityByEmail(email);

    if(foundIdentity) return next();

    const tenantObj = {
      googleId: id,
      email
    }
    
    const tenant = await saveTenant(tenantObj);

    req.user = tenant;
    next();

  } catch (error) {
    next(error);
  }
};

const resendConfirmationEmail = async (req, res, next) => {
  try {
    const { user } = req;
    const url = rawUrl(user)('signup/confirm');

    const message = createEmailMessage(
      'confirm@todo.com', 
      user.email,
      'Confirm email',  
      htmlConfirmEmail(url)
    );
    await sendNotification('email')(message);

    res.status(200).send(user);
    
  } catch (error) {
    next(error)
  }
};

/**
 * Send an email message with the reset password link
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const mailPasswordReset = async (req, res, next) => {
  try {
    const { user } = req;

    const url = rawUrl(user)('login/password');
    
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

/**
 * Update tenant passwords
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const resetPassowrd = async (req, res, next) => {
  try {
    const { user } = req;
    const { password } = req.body;

    //TODO: add validation

    const tenant = await updateTenant({password}, user.id);
    
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

/**
 * Generate Tokens and attach it to the response via cookie
 * @param {*} res 
 * @param {*} user 
 * @param {*} csrfToken 
 */
const createTokensAndCookies = (res, user, csrfToken) => {
  const rawToken = R.pipe(
    createPayload(_, csrfToken),
    createToken, 
  )(user);

  const token = rawToken(tokenKey, tokenExp);
  const refreshToken = rawToken(refreshTokenKey, refreshTokenExp);
  
  createCookie(res, 'token', token, COOKIE_MAX_AGE);
  createCookie(res, 'refresh-token', refreshToken, COOKIE_MAX_AGE);
}

const login = (req, res) => {
  const { user } = req;
  const csrfToken = uuidv4();

  createTokensAndCookies(res, user, csrfToken);
  res.status(200).send({csrfToken, ...user});
};

const loginGoogle = (req, res, next) => {
  const { user } = req;
  const csrfToken = uuidv4();

  createTokensAndCookies(res, user, csrfToken);
  req.csrfToken = csrfToken
  next();
};

/**
 * Send new token
 * @param {*} req 
 * @param {*} res 
 * Check if the csrf token exist otherwise it will create a payload with undefined token
 * and it will always be authorized
 */
const relogin = (req, res) => {
  const { user } = req;
  const csrfToken = req.headers['csrf-token'];

  if(!csrfToken){
    return res.status(401).send({});
  };

  createTokensAndCookies(res, user, csrfToken)
  res.status(200).send({});
};

/**
 * Logout the client
 * @param {*} req 
 * @param {*} res 
 * Invalidate the old cookies giving a maxAge of 0.
 */
const logout = (req, res) => {
  createCookie(res, 'token', '', 0);
  createCookie(res, 'refresh-token', '', 0);
  res.status(200).send({});
}

module.exports = {
  login,
  loginGoogle,
  relogin,
  resetPassowrd,
  mailPasswordReset,
  resendConfirmationEmail,
  signup,
  signupGoogle,
  logout,
  confirmAccount
}