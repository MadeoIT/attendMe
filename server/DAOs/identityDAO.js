const db = require('../models');

module.exports = {
  findIdentityByEmail: (email) => db.Identity.find({
    where: { email }
  }),
  findIdentityByEmailAndConfirmed: (email) => db.Identity.find({
    where: { email, confirmed: true }
  }),
  findIdentityByTenantId: (tenantId) => db.Identity.find({
    where: { tenantId, employeeId: null }
  }),
  createIdentity: (identityObj) => db.Identity.create(identityObj),
  
  /**
   * Update through instance
   * @param {Boolean} hooks if password is not what we want to update, then
   * this parameter must be set to FALSE otherwise this method will invoke the 
   * BeforeUpdate hook and update an empty password.
   * @returns {Promise} update method
   */
  updateIdentityByTenantId: async (identityObj, tenantId, hooks) => {
    const identity = await db.Identity.find({
      where: { tenantId, employeeId: null }
    });
    return identity.update(identityObj, { hooks });
  }
}