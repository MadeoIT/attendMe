const { checkTenantCredential, saveTenant } = require('../../Services/tenantService');
const { generateTenant, generateFakeTenantObj } = require('../sharedBehaviours');
const db = require('../../models');
const bcrypt = require('bcryptjs');

describe('Tenant', () => {

  afterEach(async () => {
    await db.Tenant.destroy({
      where: {}
    })
  });

  describe('validate tenant', () => {
    let done;
    const fakeTenant1 = generateFakeTenantObj();
    const fakeTenant2 = generateFakeTenantObj();

    beforeEach(async () => {
      done = (_, res) => res;

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
    const req = {
      body: {...fakeTenant}
    };
    const res = {};
    const next = () => {};

    it('should save a tenant', async() => {
      await saveTenant('local')(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user.email).toBe(fakeTenant.email);
      expect(req.user.password).not.toBe(fakeTenant.password);
    });
  })
  //TODO: update test for update and save
  describe.skip('reset tenant password', () => {
    let fakeTenant, tenant, payload
    const PASSWORD = 'newPassword'
    const req = { body: {password: PASSWORD}};
    const done = (error, res) => res;

    beforeEach(async () => {
      fakeTenant = generateFakeTenantObj();
      tenant = await generateTenant(fakeTenant);
      payload = { sub: tenant.id };
    });

    it('should reset the password', async () => {
      const res = await resetTenantPassword(req, payload, done);
      const passwordRes = bcrypt.compare(PASSWORD, res.password);

      expect(res.password).toBeDefined();
      expect(passwordRes).toBeTruthy();
    })
  })
})