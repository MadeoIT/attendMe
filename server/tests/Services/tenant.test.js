const {
  checkTenantCredential,
  checkTenantToken,
  resetTenantPassword
} = require('../../Services/tenantService');
const {
  generateTenant,
  generateFakeTenantObj
} = require('../sharedBehaviours');
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

  describe('validate tenant jwt', () => {
    const fakeTenant1 = generateFakeTenantObj();
    const fakeTenant2 = generateFakeTenantObj();
    const payload = {
      name: fakeTenant1.email
    };
    let done;

    beforeEach(async () => {
      done = (_, res) => res;
      const result = await Promise.all([
        generateTenant(fakeTenant1),
        generateTenant(fakeTenant2)
      ]);
      payload.sub = result[0].id;
    });

    it('should find a tenant by id from token payload', async () => {
      const res = await checkTenantToken(payload, done);

      expect(res).toBeTruthy();
      expect(res.email).toBe(fakeTenant1.email);
    });

    it('should NOT find a tenant by id from token payload', async () => {
      const fakePayload = {
        sub: 1
      };
      const result = await checkTenantToken(fakePayload, done);

      expect(result).toBeFalsy();
    });
  });

  describe('reset tenant password', () => {
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