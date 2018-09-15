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
  }),
  findTenantByIdJoin: (tenantId) => db.Tenant.findOne({
    where: {
      id: tenantId
    },
    include: [db.Identity, db.Address, db.UserInfo]
  })
}