const db = require('../models');

module.exports = {
  findTenantByEmail: (email) => db.Tenant.findOne({
    where: {
      email: email
    }
  }),
  findTenantByConfirmedEmail: (email) => db.Tenant.findOne({
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
  createTenant: (tenantObj) => db.Tenant.create(tenantObj)
}