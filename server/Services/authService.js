const config = require('config');
const uuidv4 = require('uuid/v4');
const { updateTenant, saveTenant, tenantObjects } = require('../Services/tenantService');
const messages = require('../middleware/messages');
const { sendNotification } = require('../Services/notificationService');
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

const resetPassowrd = async (req, res, next) => {
  try {
    const { user } = req;

    const tenantObj = tenantObjects.password(user);
    const tenant = await updateTenant(tenantObj, user.id);
    
    const message = messages.resetPasswordConfirmation(tenant);
    await sendNotification('email')(message);
   
    res.status(200).send(tenant);

  } catch (error) {
    next(error);
  }
};

const mailPasswordReset = async (req, res, next) => {
  try {
    const { user } = req;

    const message = messages.resetPassword(user)
    await sendNotification('email')(message);
    
    res.status(200).send(req.user);

  } catch (error) {
    next(error);
  }
};

const signup = async (req, res, next) => {
  try {
    const { body } = req;
    const tenantObj = await tenantObjects.password(body);
    const tenant = await saveTenant(tenantObj);

    if(!tenant.result && tenant.message) {
      return res.status(400).send(tenant.message);
    };

    const message = messages.confirmation(tenant)
    await sendNotification('email')(message);
    res.status(200).send(tenant);

  } catch (error) {
    next(error);
  }
};

const confirmAccount = async (req, res, next) => {
  try {
    const { user } = req;

    const tenantObj = tenantObjects.confirmed();
    const tenant = await updateTenant(tenantObj, user.id);

    const message = messages.welcome(tenant)
    await sendNotification('email')(message);
    res.status(200).send(tenant);

  } catch (error) {
    next(error);
  }
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

const sendToken = (req, res) => {
  const { user } = req;
  const payload = makePayload(user);
  const token = createToken(payload, tokenKey, tokenExp);

  createCookie(res, 'token', token)

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