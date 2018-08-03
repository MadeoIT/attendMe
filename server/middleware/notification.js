const nodemailer = require('nodemailer');
const config = require('config');
const EMAIL_HOST = config.get("emailService.EMAIL_HOST");
const EMAIL_USER = config.get("emailService.EMAIL_USER");
const EMAIL_PASS = config.get("emailService.EMAIL_PASS");
const EMAIL_PORT = config.get("emailService.EMAIL_PORT");

const transport = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

const sendEmailNodemailer = (message) => {
  return transport.sendMail(message);
};

const createEmailMessage = (from, to, subject, html) => {
  return {
    from,
    to,
    subject,
    html,
  }
};

/**
 * Depending on the enviroment variable return the email service
 * Ex: if the env is 'production' you would like to send email
 * with dedicated email provider, Mailgun, Sendgrid.
 * While in testing and development another kind of service.
 * @param {String} environment enviroment variable
 * @returns {Function} the function correspondant to the service
 */
const getMailService = (environment) => {
  switch (environment) {
    case 'test':
      return sendEmailNodemailer;
    case 'development':
      return sendEmailNodemailer;
    case 'production':
      return
    default:
      sendEmailNodemailer;
      return
  }
};
const sendEmail = getMailService(process.env.NODE_ENV);

module.exports = {
  sendEmail,
  createEmailMessage
}