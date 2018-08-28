const request = require('supertest');
const db = require('../../models');
const auth = require('../../middleware/auth');
const tenantDAO = require('../../DAOs/tenantDAO');

describe('google auth20', () => {
  let server;
  const baseUrl = '/auth/google/callback';
  const user = {
    id: '123',
    emails: [{
      value: 'email@gmail.com'
    }]
  };

  beforeEach(() => {
    jest.spyOn(auth, 'isValid').mockReturnValue((req, res, next) => {
      req.user = user;
      next();
    });
    server = require('../../app');
  });

  afterEach(async () => {
    server.close();
    await db.Tenant.destroy({
      where: {}
    });
  });

  it('should not add a new user via google', async () => {
    const res = await request(server)
      .get(baseUrl);

    expect(res.status).toBe(302);
    expect(res.header['set-cookie'][0]).toContain('token');
  });

  it('should not add a new user via google / user already registered', async () => {
    await db.Tenant.create({googleId: '123', email: user.emails[0].value});
    tenantDAO.createTenant = jest.fn();
    const res = await request(server)
      .get(baseUrl);

    expect(res.status).toBe(302);
    expect(res.header['set-cookie'][0]).toContain('token');
    expect(tenantDAO.createTenant).not.toHaveBeenCalled();
  })
})