const db = require('../models');

module.exports = {
  findTenantByEmail: (email) => db.Tenant.findOne({ where: {email: email}}),
  createTenant: (tenantObj) => db.Tenant.create(tenantObj)
}