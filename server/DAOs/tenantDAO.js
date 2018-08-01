const db = require('../models');

module.exports = {
  findTenantByEmail: (email) => db.Tenant.findOne({
    where: {
      email: email
    }
  }),
  findTenantByEmailAndConfirmed: (email) => db.Tenant.findOne({
    where: {
      email: email,
      confirmed: true
    }
  }),
  findTenantByIdAndEmail: (tenantId, email) => db.Tenant.findOne({
    where: {
      id: tenantId,
      email: email,
      confirmed: true
    }
  }),
  createTenant: (tenantObj) => db.Tenant.create(tenantObj),
  updateTenantById: (tenantObj, tenantId) => db.Tenant.update(tenantObj, {
    where: {
      id: tenantId
    },
    returning: true
  })
}