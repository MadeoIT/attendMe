const messages = require('../middleware/messages');
const { sendEmail, createEmailMessage } = require('../middleware/notification');

/**
 * Send an email to the user upon chosing a type of message
 * @param {String} typeOfNotification the type of message you want to send
 * @returns {void} it simply terminate the request by sendind the email
 * The type of message should be injected in the controller
 */
const sendNotification = (typeOfNotification) => async (req) => {

  const { user } = req;

  const messageProperty = messages[typeOfNotification](user);

  const message = createEmailMessage(...messageProperty);

  await sendEmail(message);

  req.responseObj = user;

};

const sendNotificationTest = (notificationService) => async (message) => {
  await sendEmail(message)
}

module.exports = {
  sendNotification,

  sendNotificationTest
}