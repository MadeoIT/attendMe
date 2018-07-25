const request = require('supertest');
const { saveTenant, validateTenant } = require('../../Services/tenantService');
const db = require('../../models');
const config = require('config');

describe.skip('Tenant', () => {
  let server;

  beforeEach(() => {
    //server = require('../../app');
  });

  afterEach(async () => {
    //server.close();
    await db.Tenant.destroy({
      where: {}
    })
  });

  it('should add a tenant', async () => {
    const tenantObj = {
      email: 'matteo@email.com',
      password: '123'
    };

    const tenant = await saveTenant(tenantObj);
    expect(tenant.email).toBe('matteo@email.com');
    expect(tenant.password).not.toBe('123');
    expect(tenant.password.length).toBeGreaterThan(15);
  });

  describe('validate tenant', () => {
    let done;
    const PASSWORD = '123';
    const EMAIL = 'matteo@gmail.com';

    beforeEach(async() => {
      done = (_, res) => res;

      await Promise.all([
        await saveTenant({ name: 'matteo', email: EMAIL, password: PASSWORD}),
        await saveTenant({ name: 'pippo', email: 'pippo@emil.com', password: 'password'}),
      ]);
    });

    it('should find a tenant by email and validate him', async() => {
      const result = await validateTenant(EMAIL, PASSWORD, done);
  
      expect(result).toBeTruthy();
    });
  
    it('should not find a tenant by email', async() => {
      const result = await validateTenant('wrongEmail', PASSWORD, done);

      expect(result).toBeFalsy();
    });

    it('should fail to validate password', async() => {
      const result = await validateTenant(EMAIL, 'wrongPassword', done);

      expect(result).toBeFalsy();
    });
  })
})