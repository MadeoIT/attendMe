const indentityHooks = require('../../models/hooks/identityHooks');
const encryption = require('../../utils/encryption');

describe('identity model', () => {
  const PASSWORD = 'password';

  it('should hash the password correctly', async () => {
    const hashedPassword = await indentityHooks.getHashedPassword(PASSWORD);

    expect(encryption.comparePassword(PASSWORD, hashedPassword)).toBeTruthy();
  })

  it('should set the hashed password', async () => {
    indentityHooks.getHashedPassword = jest.fn().mockResolvedValue('hashedPassword');
    const identity = {
      email: 'some@email.com',
      password: PASSWORD,
    }
    await indentityHooks.beforeCreateIdentity(identity);

    expect(identity.password).toBe('hashedPassword');
    expect(indentityHooks.getHashedPassword).toHaveBeenCalledWith(PASSWORD);
  });

  it('should not set a password', async () => {
    indentityHooks.getHashedPassword = jest.fn();
    const identity = {
      email: 'some@email.com',
      googleId: 'googleId'
    }
    await indentityHooks.beforeCreateIdentity(identity);

    expect(indentityHooks.getHashedPassword).not.toHaveBeenCalled();
  });

  it('should throw an error password not present', async () => {
    indentityHooks.getHashedPassword = jest.fn();
    const identity = {
      email: 'some@email.com'
    }
    try {
      await indentityHooks.beforeCreateIdentity(identity);

    } catch (error) {
      expect(error).toEqual(new Error('Password is required'));
      expect(indentityHooks.getHashedPassword).not.toHaveBeenCalled();
    }
  })
})