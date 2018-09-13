const indentityHooks = require('../../models/hooks/identityHooks');
const encryption = require('../../utils/encryption');

describe('identity model', () => {
  const PASSWORD = 'password';

  afterEach(() => jest.resetAllMocks());

  it('should hash the password correctly', async () => {
    const hashedPassword = await indentityHooks.getHashedPassword(PASSWORD);

    expect(encryption.comparePassword(PASSWORD, hashedPassword)).toBeTruthy();
  });

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
      expect(error.message).toBe('Password is required');
      expect(indentityHooks.getHashedPassword).not.toHaveBeenCalled();
    }
  });

  it('should set the hashed password before update', async () => {
    indentityHooks.getHashedPassword = jest.fn().mockResolvedValue('hashedPassword');
    const identity = {
      password: PASSWORD
    }
    await indentityHooks.beforeUpdateIdentity(identity);

    expect(identity.password).toBe('hashedPassword');
    expect(indentityHooks.getHashedPassword).toHaveBeenCalledWith(PASSWORD);
  });

  it('should throw an google id', async () => {
    indentityHooks.getHashedPassword = jest.fn();
    const identity = {
      password: PASSWORD,
      googleId: 'googleId'
    }
    try {
      await indentityHooks.beforeCreateIdentity(identity);

    } catch (error) {
      expect(error.message).toBe('You cannot update password for this email');
      expect(indentityHooks.getHashedPassword).not.toHaveBeenCalled();
    }
  });
})