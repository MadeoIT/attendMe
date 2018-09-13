const request = require('supertest');
const db = require('../../models');
const auth = require('../../middleware/auth');
const tenantDAO = require('../../DAOs/tenantDAO');
const mock = require('../sharedBehaviours');

describe('google auth20', () => {
  let server;
  const baseUrl = '/auth/google/callback';
  const user = mock.generateTenantObjGoogle();

  beforeEach(() => {
    jest.spyOn(auth, 'isValid').mockReturnValue((req, res, next) => {
      req.user = user;
      next();
    });
    server = require('../../app');
  });

  afterEach(async () => {
    server.close();
    await Promise.all([
      db.Tenant.destroy({where: {}}),
      db.Identity.destroy({where: {}}),
      db.Address.destroy({where: {}}),
      db.UserInfo.destroy({where: {}})
    ])
  });

  it('should add a new user via google', async () => {
    const res = await request(server)
      .get(baseUrl);

    expect(res.status).toBe(302);
    expect(res.header['set-cookie'][0]).toContain('token');
  });

  it('should not add a new user via google / user already registered', async () => {
    await db.Identity.create({googleId: '123', email: 'gioioso.matteo@gmail.com'});
    tenantDAO.createTenant = jest.fn();
    const res = await request(server)
      .get(baseUrl);
    const identities = await db.Identity.findAll();

    expect(res.status).toBe(302);
    expect(res.header['set-cookie'][0]).toContain('token');
    expect(tenantDAO.createTenant).not.toHaveBeenCalled();
    expect(identities).toHaveLength(1);
  })
})