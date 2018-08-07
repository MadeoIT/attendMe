const config = require('config');
const origin = config.get('origin');

const createTokenizedUrl = (token) => (partialUrl) => {
  return `${origin}/api/${partialUrl}/${token}`
};

const createEmailMessage = (from, to, subject, html) => {
  return {
    from, to, subject, html
  }
};

const htmlConfirmEmail = (url) =>
  `<h1>Please click on the link to confirm your email</h1>
  <a href="${url}">Confirm your email</a>`

const htmlGeolocationMismatch = (tenant) => 
  `<h1>Hello ${tenant.email}</h1></br>
  <h2>You have recently logged in another location</h2>
  <p>If you did not recognize this activity you should reset your password</p>`

const htmlResetPassword = (url) => 
  `<h1>Please click on the link to reset your password</h1>
  <a href="${url}">reset your password</a></br>
  <p>If you did not perform such operation and you suspect someone else is trying to login with
  your account click on the link below to lock your account</p>`;

const htmlResetPasswordConfirm = (tenant) => 
  `<h1>Hello ${tenant.email}</h1></br>
  <h2>Your password has been reset</h2>
  <p>If you did not perform such operation click the link below to block your account
  and contact us!</p>`;

const htmlWelcome = (tenant) =>
  `<h1>Hello ${tenant.email}</h1></br>
  <h2>Congratulation your email has been verified</h2>`

module.exports = {
  htmlGeolocationMismatch,
  htmlResetPassword,
  htmlResetPasswordConfirm,
  htmlConfirmEmail,
  htmlWelcome,
  createEmailMessage,
  createTokenizedUrl
};
