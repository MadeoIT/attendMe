const { checkTenantCredential, saveTenant, saveTenantGoogle } = require('../../Services/tenantService');
const { generateFakeTenantObj } = require('../sharedBehaviours');
const { generateSalt, hashPassword } = require('../../middleware/encryption');
const tenantDAO = require('../../DAOs/tenantDAO');
const R = require('ramda');

describe.skip('Tenant', () => {

  describe('Check tenant credential', () => {
    let done;
    const fakeTenant = generateFakeTenantObj();

    beforeEach(async () => {
      done = (_, res) => res; //Mock the done function from passport
    });

    it('should find a tenant by email and validate him', async () => {
      const hashedPassword = await R.pipeP(generateSalt, hashPassword(fakeTenant.password))();
      const fakeTenantHashedPassoword = {...fakeTenant};
      fakeTenantHashedPassoword.password = hashedPassword
      tenantDAO.findTenantByEmailAndConfirmed = jest.fn().mockResolvedValue(fakeTenantHashedPassoword);
      
      const result = await checkTenantCredential(fakeTenant.email, fakeTenant.password, done);

      expect(result).toBeTruthy();
      expect(result.email).toBe(fakeTenant.email);
    });

    it('should not find a tenant by email', async () => {
      tenantDAO.findTenantByEmailAndConfirmed = jest.fn();
      comparePassword = jest.fn()
      const result = await checkTenantCredential('wrongEmail', fakeTenant.password, done);

      expect(comparePassword).not.toHaveBeenCalled();
      expect(result).toBeFalsy();
    });

    it('should fail to validate password', async () => {
      const result = await checkTenantCredential(fakeTenant.email, 'wrongPassword', done);

      expect(result).toBeFalsy();
    });
  });

  describe('save tenant', () => {
    const fakeTenant = generateFakeTenantObj();

    it('should save a tenant', async() => {
      tenantDAO.findTenantByEmail = jest.fn();
      tenantDAO.createTenant = jest.fn();
      await saveTenant(fakeTenant);
      
      expect(tenantDAO.createTenant.mock.calls[0][0].password).not.toEqual(fakeTenant.password);
    });

    it('should not save a tenant / email already exist', async() => {
      tenantDAO.findTenantByEmail = jest.fn().mockResolvedValue(fakeTenant);
      tenantDAO.createTenant = jest.fn();
      const response = await saveTenant(fakeTenant);

      expect(tenantDAO.createTenant).not.toHaveBeenCalled();
      expect(response.result).toBeFalsy();
      expect(response.message).toBe('Email already exist');
    });

    it('should not save a tenant / forbidden property', async() => {
      tenantDAO.findTenantByEmail = jest.fn();
      tenantDAO.createTenant = jest.fn();
      fakeTenant.confirmed = true;
      const response = await saveTenant(fakeTenant);
      
      expect(tenantDAO.findTenantByEmail).not.toHaveBeenCalled();
      expect(tenantDAO.createTenant).not.toHaveBeenCalled();
      expect(response.result).toBeFalsy();
      expect(response.message).toBe('\"confirmed\" is not allowed');
    });

    it('should save a tenant via google', async () => {
      const tenantGoogle = { googleId: '123', email: 'email@google.com' };
      tenantDAO.findTenantByEmail = jest.fn();
      tenantDAO.createTenant = jest.fn().mockResolvedValue(tenantGoogle);

      const tenant = await saveTenantGoogle(tenantGoogle);
      
      expect(tenant).toMatchObject(tenantGoogle);
      expect(tenantDAO.createTenant).toHaveBeenCalledWith(tenantGoogle);
      expect(tenantDAO.findTenantByEmail).toHaveBeenCalledWith(tenantGoogle.email)
    });

    it('should not save a tenant via google / account already present', () => {
      tenantDAO.findTenantByEmail = jest.fn().mockResolvedValue(fakeTenant);
      tenantDAO.createTenant = jest.fn();

      expect(tenantDAO.createTenant).not.toHaveBeenCalled();
    })
  });
});