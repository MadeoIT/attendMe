const { getMailService, sendNotification } = require('../../middleware/notification');

describe('Notification middleware', () => {
  it('should get a service depending on the environment', () => {
    const emailService = getMailService('test');

    expect(typeof(emailService)).toBe('function');
  });

  it('should send a notification', async () => {
    const response = await sendNotification('email')({
      from: 'me', to: 'email@email.com', subject: 'test', html: '<h1>Test</h1>'
    });

    expect(Object.keys(response)).toContain('accepted');
  })
})