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

  it('should confirm a tenant', async () => {
    const tenant = mock.generateTenantObj();
    const savedTenant = await tenantService.saveTenant(tenant);
    const tokenId = mock.generateConfirmationToken(savedTenant);
    const res = await request(server)
      .get(`${baseUrl}/signup/${tokenId}`);

    expect(res.status).toBe(200);
    expect(res.body.confirmed).toBe(true);
    expect(res.body.id).toBe(savedTenant.id);
    expect(res.body.email).toBe(tenant.email);
    expect(res.body.password).toBeUndefined();
  })
})