const {
  checkTenantCredential,
  saveTenant, updateTenant
} = require('../../Services/tenantService');
const mock = require('../sharedBehaviours');
const {
  generateSalt,
  hashPassword
} = require('../../utils/encryption');
const tenantDAO = require('../../DAOs/tenantDAO');
const identityDAO = require('../../DAOs/identityDAO');
const addressDAO = require('../../DAOs/addressDAO');
const userInfoDAO = require('../../DAOs/userInfoDAO');
const R = require('ramda');

describe('Tenant', () => {

  describe('save tenant', () => {
    const tenant = mock.generateTenantObj();
    const savedTenant = mock.generateTenantFromDb();

    beforeEach(() => {
      identityDAO.createIdentity = jest.fn().mockResolvedValue({
        toJSON: () => mock.generateIdentityFromDb(false)
      });
      addressDAO.createAddress = jest.fn().mockResolvedValue({
        toJSON: () => mock.generateAddressFromDb(false)
      });
      userInfoDAO.createUserInfo = jest.fn().mockResolvedValue({
        toJSON: () => mock.generateUserInfoFromDb(false)
      });
      tenantDAO.createTenant = jest.fn().mockResolvedValue({
        toJSON: () => savedTenant
      });
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('should save a tenant', async () => {
      identityDAO.findIdentityByEmail = jest.fn();
      
      const res = await saveTenant(tenant);
      
      expect(Object.keys(res)).toHaveLength(9);
      expect(res.tenantId).toBe(saveTenant.id);
    });

    it('should save a tenant with google id', async () => {
      const tenantGoogle = mock.generateTenantObjGoogle();
      
      tenantDAO.createTenant = jest.fn().mockImplementation(() => ({
        toJSON: () => savedTenant
      }));
      const res = await saveTenant(tenantGoogle);

      expect(identityDAO.findIdentityByEmail).toHaveBeenCalledWith(tenantGoogle.email);
      expect(res.id).toBe(savedTenant.id);
    })

    it('should not save a tenant / email already exist', async () => {
      identityDAO.findIdentityByEmail = jest.fn().mockResolvedValue(mock.generateIdentityFromDb(false));

      try {
        await saveTenant(tenant);
      } catch (error) {

        expect(error.message).toContain('Email already exist');
        expect(error.status).toBe(400);
      }
    });

    it.skip('should not save a tenant / forbidden property', async () => {
      tenantDAO.findTenantByEmail = jest.fn();
      tenantDAO.createTenant = jest.fn();
      fakeTenant.confirmed = true;
      const response = await saveTenant(fakeTenant);

      expect(tenantDAO.findTenantByEmail).not.toHaveBeenCalled();
      expect(tenantDAO.createTenant).not.toHaveBeenCalled();
      expect(response.result).toBeFalsy();
      expect(response.message).toBe('\"confirmed\" is not allowed');
    });
  });

  describe.skip('Check tenant credential', () => {
    let done;
    const fakeTenant = mock.generateTenantObj();

    beforeEach(async () => {
      done = (_, res) => res; //Mock the done function from passport
    });

    it('should find a tenant by email and validate him', async () => {
      const hashedPassword = await R.pipeP(generateSalt, hashPassword(fakeTenant.password))();
      const fakeTenantHashedPassoword = { ...fakeTenant
      };
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