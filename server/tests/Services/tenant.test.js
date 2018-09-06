const { checkTenantCredential, saveTenant, saveTenantGoogle } = require('../../Services/tenantService');
const mock = require('../sharedBehaviours');
const { generateSalt, hashPassword } = require('../../utils/encryption');
const tenantDAO = require('../../DAOs/tenantDAO');
const identityDAO = require('../../DAOs/identityDAO');
const addressDAO = require('../../DAOs/addressDAO');
const userInfoDAO = require('../../DAOs/userInfoDAO');
const R = require('ramda');

describe('Tenant', () => {

  describe('save tenant', () => {
    const tenant = mock.generateTenantObj();
    const savedTenant = mock.generateTenantFromDb();

    it.only('should save a tenant', async() => {
      tenantDAO.findTenantByEmail = jest.fn();
      identityDAO.createIdentity = jest.fn();
      addressDAO.createAddress = jest.fn();
      userInfoDAO.createUserInfo = jest.fn();
      tenantDAO.createTenant = jest.fn().mockResolvedValue(savedTenant);
      await saveTenant(tenant);
      
      expect(tenantDAO.findTenantByEmail).toHaveBeenCalledWith(tenant.email);
      expect(identityDAO.createIdentity.mock.calls[0][0].tenantId).toBe(savedTenant.id);
      expect(identityDAO.createIdentity.mock.calls[0][0].password).toBe(tenant.password)
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

  describe.skip('Check tenant credential', () => {
    let done;
    const fakeTenant = mock.generateTenantObj();

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
});