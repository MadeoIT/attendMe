const request = require('supertest');
const { generateFakeTenantObj, generateTenant } = require('../sharedBehaviours');

describe('Notification', () => {
  let server;

  beforeEach(() => {
    server = require('../../app');
  });

  afterEach(()=> {
    server.close();
  });

  it('should send link for password reset', async () => {
    const fakeTenant = generateFakeTenantObj();
    await generateTenant(fakeTenant);
    const { email } = fakeTenant;
    const baseUrl = '/api/auth/password';
    const res = await request(server)
      .post(baseUrl)
      .send({email});
    
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(email);
  })
})