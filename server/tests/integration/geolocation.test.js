const request = require('supertest');
const db = require('../../models');
const {
  generateTenant,
  generateTokenAndCsrfToken,
  generateFakeTodoObj,
  generateFakeTenantObj
} = require('../sharedBehaviours');


describe('Geolocation for POST', () => {
  let server, token, csrfToken, tenant_FK;
  const baseUrl = '/api/todos'

  beforeEach(async () => {
    server = require('../../app');
    const fakeTenant = generateFakeTenantObj()
    const tenant = await generateTenant(fakeTenant);
    result = generateTokenAndCsrfToken(tenant);
    token = result.token;
    csrfToken = result.csrfToken;
    tenant_FK = tenant.id;
  });

  afterEach(async () => {
    server.close();
    await Promise.all([
      db.Todo.destroy({
        where: {},
        truncate: true
      }),
      db.Tenant.destroy({
        where: {}
      })
    ])
  })

  it.skip('should send and set the coockie with the last location', async() => {
    const fakeTodo = generateFakeTodoObj();
    const res = await request(server)
      .post(baseUrl)
      .set('Cookie', `token=${token};last-location=51.9,4.5`)
      .set('current-location', '52.5,-0.2')
      .set('csrf-token', csrfToken)
      .send(fakeTodo);

    expect(res.status).toBe(200);
    expect(res.header['set-cookie'][0]).toContain("last-location=52.5%2C-0.2;");
  });

  it('should NOT send an alert and set cookie / Location not provided', async() => {
    const fakeTodo = generateFakeTodoObj();
    const res = await request(server)
      .post(baseUrl)
      .set('Cookie', `token=${token};last-location=51.9,4.5`)
      .set('csrf-token', csrfToken)
      .send(fakeTodo);

    expect(res.status).toBe(200);
    expect(res.header['set-cookie']).toBeUndefined();
  });
})