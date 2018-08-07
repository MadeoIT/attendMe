const { 
  checkTenantCredential, saveTenant, updateTenant
} = require('../../Services/tenantService');
const { generateTenant, generateFakeTenantObj } = require('../sharedBehaviours');
const { generateSalt, hashPassword } = require('../../middleware/encryption');
const db = require('../../models');

describe('Tenant', () => {

  afterEach(async () => {
    await db.Tenant.destroy({
      where: {}
    })
  });

  describe('Check tenant credential', () => {
    let done;
    const fakeTenant1 = generateFakeTenantObj();
    const fakeTenant2 = generateFakeTenantObj();

    beforeEach(async () => {
      done = (_, res) => res; //Mock the done function from passport

      await Promise.all([
        generateTenant(fakeTenant1),
        generateTenant(fakeTenant2)
      ]);
    });

    it('should find a tenant by email and validate him', async () => {
      const result = await checkTenantCredential(fakeTenant1.email, fakeTenant1.password, done);

      expect(result).toBeTruthy();
      expect(result.email).toBe(fakeTenant1.email);
    });

    it('should not find a tenant by email', async () => {
      const result = await checkTenantCredential('wrongEmail', fakeTenant1.password, done);

      expect(result).toBeFalsy();
    });

    it('should fail to validate password', async () => {
      const result = await checkTenantCredential(fakeTenant1.email, 'wrongPassword', done);

      expect(result).toBeFalsy();
    });
  });

  describe('save tenant', () => {
    const fakeTenant = generateFakeTenantObj();

    it('should save a tenant', async() => {
      const tenant = await saveTenant(fakeTenant);

      expect(tenant).toBeDefined();
      expect(tenant.email).toBe(fakeTenant.email);
      expect(tenant.id).toBeDefined();
    });

    it('should not save a tenant / email already exist', async() => {
      const tenant = await generateTenant(fakeTenant);
      delete tenant.confirmed;
      const response = await saveTenant(fakeTenant);

      expect(response.result).toBeFalsy();
      expect(response.message).toBe('Email already exist');
    });

    it('should not save a tenant / forbidden property', async() => {
      fakeTenant.confirmed = true;
      const response = await saveTenant(fakeTenant);
    
      expect(response.result).toBeFalsy();
      expect(response.message).toBe('\"confirmed\" is not allowed');
    });
  });

  describe('Tenant object', () => {
    it('should return a tenant object with the hashed password', async() => {
      const tenantObj = generateFakeTenantObj();
      const salt = await generateSalt();
      const hashedPassword = await hashPassword(tenantObj.password, salt);
      const tenantObjWithHashedPass = {...tenantObj };
      tenantObjWithHashedPass.password = hashedPassword;
      
      expect(tenantObjWithHashedPass.password).toBeDefined();
      expect(tenantObjWithHashedPass.password).not.toBe(tenantObj.password);
      expect(Object.keys(tenantObjWithHashedPass).length).toBe(2);
    });

    //TODO: google etc...
  });

  describe('Update tenant', () => {
    it('should update a tenant', async() => {
      const fakeTenant = generateFakeTenantObj();
      const tenant = await generateTenant(fakeTenant);
      fakeTenant.fullName = 'Matteo Gioioso';
      const updatedTenant = await updateTenant(fakeTenant, tenant.id);

      expect(updatedTenant.fullName).toBe('Matteo Gioioso');
      expect(updatedTenant.id).toBe(tenant.id);
    });
  });
});