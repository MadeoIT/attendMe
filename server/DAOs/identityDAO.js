const db = require('../models');

module.exports = {
  findIdentityByEmail: (email) => db.Identity.find({
    where: { email }
  }),
  findIdentityByTenantId: (tenantId) => db.Identity.find({
    where: { tenantId, employeeId: null }
  }),
  createIdentity: (identityObj) => db.Identity.create(identityObj),
  updateIdentityByTenantId: async (identityObj, tenantId) => {
    const identity = await db.Identity.find({
      where: { tenantId, employeeId: null }
    });
    return identity.update(identityObj);
  }
}