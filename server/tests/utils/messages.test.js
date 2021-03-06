const { createEmailMessage, createTokenizedUrl } = require('../../utils/messages');
const { generateTenantObj } = require('../sharedBehaviours');

describe('messages', () => {

  it('should create an email object', () => {
    const tenant = generateTenantObj();
    const html = '<h1>Message</h1>';
    const messageObj = createEmailMessage('email@email.com', tenant.email, 'Message', html);

    expect(messageObj.subject).toBe('Message');
  });

  it('should return an url', () => {
    const url = createTokenizedUrl('token123')('user/stuff');

    expect(url).toContain('user/stuff/token123');
  });
});