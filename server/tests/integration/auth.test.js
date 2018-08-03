const request = require('supertest');
const db = require('../../models');
const tenantDAO = require('../../DAOs/tenantDAO');
const {
  generateRefreshTokenAndCsrfToken,
  generateFakeTenantObj,
  generateTenant,
  generateConfirmationToken
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

  describe('login', () => {
    const loginUrl = '/api/auth/login';
    let EMAIL, PASSWORD;

    beforeEach(async () => {
      const fakeTenant = generateFakeTenantObj()
      const tenant = await generateTenant(fakeTenant);
      EMAIL = tenant.email;
      PASSWORD = fakeTenant.password;
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

    it('should not authenticate the user. Wrong password', async () => {
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

    it('should not find a user. Wrong Email', async () => {
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
    let refreshToken, csrfToken;

    beforeEach(async () => {
      const fakeTenant = generateFakeTenantObj();
      const tenant = await generateTenant(fakeTenant);
      result = generateRefreshTokenAndCsrfToken(tenant);
      refreshToken = result.refreshToken;
      csrfToken = result.csrfToken;
    });

    it('should relogIn with a new token', async () => {
      const res = await request(server)
        .post(reloginUrl)
        .set('Cookie', `refresh-token=${refreshToken}`)
       
      expect(res.status).toBe(200);
      expect(res.header['set-cookie']).toBeDefined();
    });

    it('should not allowed relogIn with a new token. Wrong token', async () => {
      const res = await request(server)
        .post(reloginUrl)
        .set('Cookie', `refresh-token=123fakeTokenAbc`)

      expect(res.status).toBe(401);
    })
  });

  describe('confirm email', () => {
    let confirmationToken, fakeTenant;
    const baseUrl = '/api/auth/signup';

    beforeEach( async () => {
      fakeTenant = generateFakeTenantObj();
      const tenant = await generateTenant(fakeTenant);
      confirmationToken = generateConfirmationToken(tenant);
    });

    it('should confirm the email of the user', async () => {
      const res = await request(server)
        .get(`${baseUrl}/${confirmationToken}`);

      expect(res.status).toBe(200);
      expect(res.body.confirmed).toBeTruthy();
      expect(res.body.email).toBe(fakeTenant.email);
    });
  });

  describe('reset password', () => {
    let resetToken, fakeTenant, tenant;
    const baseUrl = '/api/auth/password';

    beforeEach( async () => {
      fakeTenant = generateFakeTenantObj();
      tenant = await generateTenant(fakeTenant);
      resetToken = generateConfirmationToken(tenant);
    });

    it('should reset password', async () => {
      fakeTenant.password = '987654321'
      const res = await request(server)
        .post(`${baseUrl}/${resetToken}`)
        .send({ password: fakeTenant.password });

      expect(res.status).toBe(200);
    })
  });

  describe('google auth20', () => {
    const baseUrl = '/api/auth/google';

    it('should hit the callback end point', async () => {
      const res = await request(server)
        .get(baseUrl);
      
      expect(res.status).toBe(200);
      expect(res.body.email).toBe('gioioso.matteo@gmail.com');
    });

    it('should not add a new user', async () => {
      
    })
  })

  describe('signup', () => {
    const baseUrl = '/api/auth/signup';
    let tenantObj;

    beforeEach(() => {
      tenantObj = generateFakeTenantObj();
    });  
  
    it('shoduld sign up a user', async () => {
      delete tenantObj.confirmed;
      const res = await request(server)
        .post(baseUrl)
        .send(tenantObj);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe(tenantObj.email);
      expect(res.body.confirmed).toBeFalsy();
    });

    it('shoduld NOT sign up a user. User try to set confirmed true', async () => {
      tenantObj.confirmed = true;
      const res = await request(server)
        .post(baseUrl)
        .send(tenantObj)
      
      expect(res.status).toBe(400);
      expect(res.error.text).toContain('confirmed', 'forbidden');
    });

    //Error of save tenant is handled correctly 
    //And propagate through the middleware chain
    it('should handle error in saveTenant', async () => {
      delete tenantObj.confirmed;
      //Mock function only once or it gets propagated through other test down the chain
      tenantDAO.findTenantByEmail = jest
        .fn()
        .mockRejectedValueOnce(new Error('Test Error / find tenant by email'));
      const res = await request(server)
        .post(baseUrl)
        .send(tenantObj);
      
      expect(res.status).toBe(500);
      expect(res.error.text).toContain('Test Error / find tenant by email');
    })
  });
});