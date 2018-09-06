const config = require('config');
const uuidv4 = require('uuid/v4');
const R = require('ramda');

//Functions
const { updateTenant, saveTenant, saveTenantGoogle } = require('../Services/tenantService');
const { 
  createEmailMessage, createTokenizedUrl, htmlResetPassword,
  htmlResetPasswordConfirm, htmlWelcome, htmlConfirmEmail
} = require('../utils/messages');
const { sendNotification } = require('../utils/notification');
const { createToken, createPayload, createCookie } = require('../utils/token');
const { generateSalt, hashPassword } = require('../utils/encryption');

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

    if(!tenant.result && tenant.message) {
      return res.status(400).send(tenant.message);
    };

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
    next(error);
  }
};

const signupGoogle = async (req, res, next) => {
  try {
    const { id, emails } = req.user;
    const email = emails[0].value;
    const tenantObj = {
      email, googleId: id
    };
    
    const tenant = await saveTenantGoogle(tenantObj)
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
}

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
  res.status(200).send({csrfToken, id: user.id, email: user.email});
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

const resetPassowrd = async (req, res, next) => {
  try {
    const { user } = req;
    const { password } = req.body;

    if(password.length < 8) {
      return res.status(400).send('Password must be at least 8 characters');
    }

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