const db = require('../../models');
const encryption = require('../../utils/encryption');

describe('Identity model integration', () => {
  const PASSWORD = 'password';

  beforeEach(() => {

  });

  afterEach(async () => {
    await db.Identity.destroy({
      where: {}
    });
  })

  it('should save a local account', async () => {
    const identity = {
      email: 'some@email.com',
      password: PASSWORD,
    }
    const res = await db.Identity.create(identity);

    expect(encryption.comparePassword(PASSWORD, res.password)).toBeTruthy();
    expect(res.email).toBe(identity.email);
    expect(res.confirmed).toBe(false);
    expect(res.blocked).toBe(false);
  });

  it('should save a google account', async () => {
    const identity = {
      email: 'some@email.com',
      googleId: 'googleId'
    }
    const res = await db.Identity.create(identity);

    expect(res.password).toBeNull();
    expect(res.googleId).toBe(identity.googleId);
    expect(res.email).toBe(identity.email);
  });

  it('throw an error password and oauthId are missing', async () => {
    const identity = {
      email: 'some@email.com',
    }
    try {
      await db.Identity.create(identity);
    } catch (error) {

      expect(error).toEqual(new Error('Password is required'));
    }
  });

  it('throw an error email is not an email', async () => {
    const identity = {
      email: 'notAValidEmail.com',
      password: PASSWORD
    }
    try {
      await db.Identity.create(identity);
    } catch (error) {

      expect(error.name).toEqual('SequelizeValidationError');
    }
  })
})