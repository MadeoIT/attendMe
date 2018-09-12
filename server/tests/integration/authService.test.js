const db = require('../../models');
const request = require('supertest');
const mock = require('../sharedBehaviours');
const tenantService = require('../../Services/tenantService');
let notification = require('../../middleware/notification');

describe('auth service integration', () => {
  let server;
  const baseUrl = '/api/auth';

  beforeEach(() => {
    notification.sendNotification = jest.fn().mockImplementation(() => () => {});
    server = require('../../app');
  });

  afterEach( async () => {
    server.close();
    await Promise.all([
      db.Tenant.destroy({where: {}}),
      db.Identity.destroy({where: {}}),
      db.Address.destroy({where: {}}),
      db.UserInfo.destroy({where: {}})
    ])
  })

  it('should save a tenant', async () => {
    const tenant = mock.generateTenantObj();
    const savedIdentity = mock.generateIdentityFromDb(false);
    let res = await request(server)
      .post(`${baseUrl}/signup`)
      .send(tenant);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe(savedIdentity.email);
    expect(res.body.password).toBeUndefined();
  });

  describe('After Signup', () => {
    let tenant, savedTenant, tokenId

    beforeEach(async () => {
      tenant = mock.generateTenantObj();
      savedTenant = await tenantService.saveTenant(tenant);
      tokenId = mock.generateConfirmationToken(savedTenant);
    })

    it('should confirm a tenant', async () => {
      const res = await request(server)
        .get(`${baseUrl}/signup/${tokenId}`);
  
      expect(res.status).toBe(200);
      expect(res.body.confirmed).toBe(true);
      expect(res.body.id).toBe(savedTenant.id);
      expect(res.body.email).toBe(tenant.email);
      expect(res.body.password).toBeUndefined();
    });
  
    it('should log tenant in', async () => {
      const res = await request(server)
        .post(`${baseUrl}/login`)
        .send({ password: tenant.password, email: tenant.email });
  
      expect(res.status).toBe(200);
      expect(res.header['set-cookie'][0]).toContain('token');
      expect(typeof res.body.csrfToken).toBe('string');
      expect(res.body.email).toBe(tenant.email);
      expect(res.body.password).toBeUndefined();
    });
  
    it('should not log tenant in / wrong password', async () => {
      const res = await request(server)
        .post(`${baseUrl}/login`)
        .send({ password: 'wrongPassword', email: tenant.email });
  
      expect(res.status).toBe(401);
    })
  })
})