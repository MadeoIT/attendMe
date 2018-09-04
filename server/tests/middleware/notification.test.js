const { getMailService, sendNotification } = require('../../middleware/notification');

describe.skip('Notification middleware', () => {
  it('should get a service depending on the environment', () => {
    const emailService = getMailService('test');

    expect(typeof(emailService)).toBe('function');
  });

  //This tests depends on your mail service if the mail service is down your test will not pass
  //This is why you should skip the test in CI mode
  it.skip('should send a notification', async () => {
    const response = await sendNotification('email')({
      from: 'me', to: 'email@email.com', subject: 'test', html: '<h1>Test</h1>'
    });

    expect(Object.keys(response)).toContain('accepted');
  })
})