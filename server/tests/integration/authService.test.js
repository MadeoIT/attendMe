const db = require('../../models');
const request = require('supertest');
const mock = require('../sharedBehaviours');
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
  })
})