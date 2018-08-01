const config = require('config');

const { sendEmail, createEmailMessage } = require('../middleware/notification');
const { makePayload, createToken } = require('../middleware/token');

const confirmationTokenExp = config.get('encryption.confirmationTokenExp');
const confirmationTokenKey = config.get('encryption.jwtConfirmationSk');

const origin = config.get('origin');

const sendConfirmationEmail = async (req, res, next) => {
  try {
    const { user } = req;
    const payload = makePayload(user);
    const confirmationToken = createToken(payload, confirmationTokenKey, confirmationTokenExp);
    const html = 
      `<h1>Please click on the link to confirm your email</h1>
        <a href="${origin}/api/auth/confirm/${confirmationToken}">Confirm your email</a>`;
    
    const message = createEmailMessage('confimation@todo.com', user.email, 'Confirmation email', html);
    await sendEmail(message);
    res.status(200).send(user);

  } catch (error) {
    next(error);
  }
}

const sendWelcomeEmail = async (req, res, next) => {
  try {
    const { user } = req;
    const html = 
      `<h1>Welcome to the app ${user.email}, your email is now verify!</h1>`;

    const message = createEmailMessage('welcome@todo.com', user.email, 'Congratulation email', html);
    await sendEmail(message);
    res.status(200).send(user);

  } catch (error) {
    next(error);
  }
};

const sendResetPasswordEmail = async (req, res, next) => {
  try {
    const { user } = req;

    const payload = makePayload(user);
    const resetToken = createToken(payload, confirmationTokenKey, confirmationTokenExp);
    
    const html = 
    `<h1>Please click on the link to reset your password</h1>
      <a href="${origin}/api/auth/password/${resetToken}">reset your password</a></br>
      <p>If you did not perform such operation and you suspect someone else is trying to login with
      your account click on the link below to lock your account</p>`;
  
    const message = createEmailMessage('reset@todo.com', user.email, 'Reset password email', html);
    await sendEmail(message);
    res.status(200).send({email: user.email});

  } catch (error) {
    next(error);
  }
}

//TODO: add lock account link
const sendResetPasswordConfirmationEmail = async (req, res, next) => {
  try {
    const { user } = req;

    const html = 
    `<h1>Hello ${user.email}</h1></br>
      <h2>Your passoword has been reset</h2>
      <p>If you did not perform such operation click the link below to block your account
      and contact us!</p>`;

    const message = createEmailMessage('reset@todo.com', user.email, 'Reset password email', html);
    await sendEmail(message);

    res.status(200).send({});
  } catch (error) {
    next(error);
  }
}

module.exports = {
 sendConfirmationEmail,
 sendWelcomeEmail,
 sendResetPasswordEmail,
 sendResetPasswordConfirmationEmail
}