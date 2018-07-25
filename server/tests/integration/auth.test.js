const request = require('supertest');
const db = require('../../models');
const { saveTenant } = require('../../Services/tenantService');

describe('login', () => {
  let server;
  const url = '/api/auth/login';
  const PASSWORD = 'password';
  const EMAIL = 'some@email.com';

  beforeEach(async() => {
    server = require('../../app');
    await saveTenant({ email: EMAIL, password: PASSWORD})
  });

  afterEach(async() => {
    server.close();
    await db.Tenant.destroy({
      where: {}
    });
  });

  it('should authenticate the user', async() => {
    const res = await request(server)
      .post(url)
      .send({email: EMAIL, password: PASSWORD});
  
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(typeof(res.body.token)).toBe('string');
  });

  it('should not authenticate the user', async() => {
    const res = await request(server)
      .post(url)
      .send({email: EMAIL, password: 'wrongPass'});

    expect(res.status).toBe(401);
    expect(Object.keys(res.body).length).toBe(0);  
  });

  it('should not find a user', async() => {
    const res = await request(server)
      .post(url)
      .send({email: 'wrong@email.com', password: PASSWORD});
    
    expect(res.status).toBe(401);  
    expect(Object.keys(res.body).length).toBe(0);
  });
})