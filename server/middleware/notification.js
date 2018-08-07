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
    case 'development':
    case 'ci':
      return sendEmailNodemailer;
    case 'production':
      return;
  }
};

const getSMSservice = (environment) =>  {

};

/**
 * Send an email to the user upon chosing a type of message
 * @param {String} typeOfNotification the type of message you want to send
 * @returns {void} it simply terminate the request by sendind the email
 * The type of message should be injected in the controller
 */
const sendNotification = (notificationType) => (message) => {
  const notificationServices = {
    email: getMailService(process.env.NODE_ENV),
    sms: getSMSservice(process.env.NODE_ENV)
  };
  return notificationServices[notificationType](message);
}

module.exports = {
  sendNotification,
  getMailService,
}