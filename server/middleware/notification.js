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

const sendEmailNodemailer = async (message) => {
  try {
    return transport.sendMail(message);

  } catch (error) {
    throw new Error(error);
  }
};

const createEmailMessage = (from, to, subject, html) => {
  return {
    from,
    to,
    subject,
    html,
  }
};

const getMailService = () => {
  switch (process.env.NODE_ENV) {
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

const sendEmail = getMailService();

module.exports = {
  sendEmail,
  createEmailMessage
}