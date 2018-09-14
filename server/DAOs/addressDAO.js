const db = require('../models');

module.exports = {
  findAddressByTenantId: (tenantId) => db.Address.find({
    where: { tenantId, employeeId: null }
  }),
  createAddress: (addressObj) => db.Address.create(addressObj),
  updateAddressByTenantId: (addressObj, tenantId) => db.Address.update(addressObj, {
    where: { tenantId, employeeId: null },
    returning: true
  })
}