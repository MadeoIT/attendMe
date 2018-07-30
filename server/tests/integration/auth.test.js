const request = require('supertest');
const db = require('../../models');
const {
  generateRefreshTokenAndCsrfToken,
  generateTenant
} = require('../sharedBehaviours')

describe('authentication', () => {
  let server;

  beforeEach(() => {
    server = require('../../app');
  });

  afterEach(async () => {
    server.close();
    await db.Tenant.destroy({
      where: {}
    });
  });
  //Makes todo add with fk fail
  describe('login', () => {
    const loginUrl = '/api/auth/login';
    const PASSWORD = '123';
    let EMAIL;

    beforeEach(async () => {
      const tenant = await generateTenant();
      EMAIL = tenant.email;
    });

    it('should authenticate the user', async () => {
      const res = await request(server)
        .post(loginUrl)
        .send({
          email: EMAIL,
          password: PASSWORD
        });

      expect(res.status).toBe(200);
      expect(res.header['set-cookie'][0]).toContain('token');
      expect(res.body.csrfToken).toBeDefined();
      expect(typeof (res.body.csrfToken)).toBe('string');
    });

    it('should not authenticate the user', async () => {
      const res = await request(server)
        .post(loginUrl)
        .send({
          email: EMAIL,
          password: 'wrongPass'
        });

      expect(res.status).toBe(401);
      expect(res.header['set-cookie']).toBeUndefined();
      expect(Object.keys(res.body).length).toBe(0);
    });

    it('should not find a user', async () => {
      const res = await request(server)
        .post(loginUrl)
        .send({
          email: 'wrong@email.com',
          password: PASSWORD
        });

      expect(res.status).toBe(401);
      expect(Object.keys(res.body).length).toBe(0);
    });
  });

  describe('relogin', () => {
    const reloginUrl = '/api/auth/relogin';
    let refreshToken;
    let csrfToken;

    beforeEach(async () => {
      const tenant = await generateTenant();
      result = generateRefreshTokenAndCsrfToken(tenant);
      refreshToken = result.refreshToken;
      csrfToken = result.csrfToken;
    });

    it('should relogIn with a new token', async () => {
      const res = await request(server)
        .post(reloginUrl)
        .set('Cookie', `refresh-token=${refreshToken}`)
        .set('Authorization', csrfToken);

      expect(res.status).toBe(200);
      expect(res.header['set-cookie']).toBeDefined();
    });

    it('should not allowed relogIn with a new token', async () => {
      const res = await request(server)
        .post(reloginUrl)
        .set('Cookie', `refresh-token=123fakeTokenAbc`)
        .set('Authorization', csrfToken);

      expect(res.status).toBe(401);
    })
  });

  //Problematic test
  describe('signup', () => {
    const signupUrl = '/api/auth/signup';
    const tenantObj = {
      email: 'matteo@email.com',
      password: '123'
    };
    it('shoduld sign up a user', async () => {
      const res = await request(server)
        .post(signupUrl)
        .send(tenantObj)

      expect(res.status).toBe(200);
      expect(res.body.email).toBe('matteo@email.com');
      expect(res.body.confirmed).toBeFalsy();
    });

    it('shoduld NOT sign up a user because of invalid property', async () => {
      tenantObj.confirmed = true;
      const res = await request(server)
        .post(signupUrl)
        .send(tenantObj)
      
      expect(res.status).toBe(400);
    });
  });

  describe.skip('confirm email', () => {
    it('should ...', async () => {
      const confirmUrl = '/api/auth/confirm';
      const confirmationToken = '123';

      const res = await request(server)
        .get(`/${confirmUrl}/${confirmationToken}`);

      expect(res.status).toBe(200);
    });
  });
});