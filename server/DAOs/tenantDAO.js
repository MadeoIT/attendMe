const db = require('../models');

module.exports = {
  findTenantById: (tenantId) => db.Tenant.findOne({
    where: {
      id: tenantId
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