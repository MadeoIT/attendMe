const { sendEmail } = require('../middleware/notification');

/**
 * Send an email to the user upon chosing a type of message
 * @param {String} typeOfNotification the type of message you want to send
 * @returns {void} it simply terminate the request by sendind the email
 * The type of message should be injected in the controller
 */
const sendNotification = (notificationService) => (message) => {
  return sendEmail(message);
}

module.exports = {
  sendNotification
}