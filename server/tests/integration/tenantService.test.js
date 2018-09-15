const db = require('../../models');
const mock = require('../sharedBehaviours');
const tenantService = require('../../Services/tenantService');
const request = require('supertest');

describe('Tenant Service', () => {
  let tenant, savedTenant, tokens, server;
  const baseUrl = '/api/tenants'

  beforeEach( async() => {
    server = require('../../app');
    tenant = mock.generateTenantObj();
    savedTenant = await tenantService.saveTenant(tenant);
    await tenantService.updateTenant({confirmed: true}, savedTenant.id);
    tokens = mock.generateTokenAndCsrfToken(savedTenant)
  });
  afterEach( async() => {
    server.close();
    await Promise.all([
      db.Tenant.destroy({where: {}}),
      db.Identity.destroy({where: {}}),
      db.Address.destroy({where: {}}),
      db.UserInfo.destroy({where: {}})
    ]);
  });

  it('should retrive all the tenant information', async() => {
    const res = await request(server)
      .get(`${baseUrl}/${savedTenant.id}`)
      .set('csrf-token', tokens.csrfToken)
      .set('Cookie', `token=${tokens.token}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe(tenant.email);
    expect(res.body.id).toBe(savedTenant.id);
    expect(res.body.password).toBeUndefined();
  })
})