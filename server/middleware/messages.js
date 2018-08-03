const config = require('config');
const { makePayload, createToken } = require('../middleware/token');
const confirmationTokenExp = config.get('encryption.confirmationTokenExp');
const confirmationTokenKey = config.get('encryption.jwtConfirmationSk');
const origin = config.get('origin');
const { createEmailMessage } = require('../middleware/notification')

/**
 * Cretate an array with all the property to build the email message
 * @param {Object} user object with id and email
 * @returns {Massage} returns an array with the necessary
 * arguments to build the email message
 */
const messages = {

  confirmation: (tenant) => {
    const payload = makePayload(tenant);
    const confirmationToken = createToken(payload, confirmationTokenKey, confirmationTokenExp);
    const html = 
      `<h1>Please click on the link to confirm your email</h1>
        <a href="${origin}/api/auth/confirm/${confirmationToken}">Confirm your email</a>`;

    return createEmailMessage('confimation@todo.com', tenant.email, 'Confirmation email',  html);
  },

  welcome: (tenant) => {
    const html = 
      `<h1>Welcome to the app ${tenant.email}, your email is now verify!</h1>`;
    return createEmailMessage('confirmation@todo.com', tenant.email, 'Welcome',  html);
  },

  resetPassword: (tenant) => {
    const payload = makePayload(tenant);
    const resetToken = createToken(payload, confirmationTokenKey, confirmationTokenExp);
    
    const html = 
    `<h1>Please click on the link to reset your password</h1>
      <a href="${origin}/api/auth/password/${resetToken}">reset your password</a></br>
      <p>If you did not perform such operation and you suspect someone else is trying to login with
      your account click on the link below to lock your account</p>`;

    return createEmailMessage('resetPassword@todo.com', tenant.email, 'Reset Password',  html);
  },

  resetPasswordConfirmation: (tenant) => {
    const html = 
    `<h1>Hello ${tenant.email}</h1></br>
      <h2>Your password has been reset</h2>
      <p>If you did not perform such operation click the link below to block your account
      and contact us!</p>`;

    return createEmailMessage('resetPassword@todo.com', tenant.email, 'Reset password successful',  html);
  }
  
};

module.exports = messages;
