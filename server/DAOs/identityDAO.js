const db = require('../models');

module.exports = {
  findIdentityByEmail: (email) => db.Identity.find({
    where: { email }
  }),
  findIdentityByTenantId: (tenantId) => db.Identity.find({
    where: { tenantId }
  }),
  createIdentity: (identityObj) => db.Identity.create(identityObj),
  updateIdentityByTenantId: (identityObj, tenantId) => db.Identity.update(identityObj, {
    where: { tenantId },
    returning: true
  })
}