const request = require('supertest');
const { saveTenant, validateTenant, validateTenantJwt } = require('../../Services/tenantService');
const { generateTenant, generateFakeTenantObj } = require('../sharedBehaviours');
const db = require('../../models');

describe('Tenant', () => {

  afterEach(async () => {
    await db.Tenant.destroy({
      where: {}
    })
  });

  //TODO: unstable test
  describe('Save tenant', () => {
    it('should add a tenant', async () => {
      const fakeTenant = generateFakeTenantObj();
      const tenant = await saveTenant(fakeTenant);
      
      expect(tenant.email).toBe(fakeTenant.email);
      expect(tenant.password).not.toBe(fakeTenant.password);
      expect(tenant.confirmed).toBeFalsy();
    });
  
    it('should not add a tenant because email already exist', async () => {
      const tenant = await generateTenant();
      const tenantObj = {
        email: tenant.email,
        password: '123'
      };
  
      const createdTenant = await saveTenant(tenantObj);
      expect(createdTenant).toBeFalsy();
    });
  })
  
  describe('validate tenant', () => {
    let done;
    const fakeTenant1 = generateFakeTenantObj();
    const fakeTenant2 = generateFakeTenantObj();

    beforeEach(async() => {
      done = (_, res) => res;

      await Promise.all([
        saveTenant({ ...fakeTenant1, confirmed: true}),
        saveTenant({ ...fakeTenant2}),
      ]);
    });

    it('should find a tenant by email and validate him', async() => {
      const result = await validateTenant(fakeTenant1.email, fakeTenant1.password, done);
  
      expect(result).toBeTruthy();
      expect(result.email).toBe(fakeTenant1.email);
    });
  
    it('should not find a tenant by email', async() => {
      const result = await validateTenant('wrongEmail', fakeTenant1.password, done);

      expect(result).toBeFalsy();
    });

    it('should fail to validate password', async() => {
      const result = await validateTenant(fakeTenant1.email, 'wrongPassword', done);

      expect(result).toBeFalsy();
    });
  });

  describe('validate tenant jwt', () => {
    const fakeTenant1 = generateFakeTenantObj();
    const fakeTenant2 = generateFakeTenantObj();
    const payload = { name: fakeTenant1.email };
    let done;
    
    beforeEach(async() => {
      done = (_,res) => res;
      const result = await Promise.all([
        saveTenant({ ...fakeTenant1, confirmed: true}),
        saveTenant({ ...fakeTenant2}),
      ]);
      payload.sub = result[0].id;
    });

    it('should find a tenant by id from token payload', async() => {
      const result = await validateTenantJwt(payload, done);
  
      expect(result).toBeTruthy();
      expect(result.email).toBe(fakeTenant1.email);
    });

    it('should NOT find a tenant by id from token payload', async() => {
      const fakePayload = { sub: 1 };
      const result = await validateTenantJwt(fakePayload, done);
  
      expect(result).toBeFalsy();
    });
  })
})