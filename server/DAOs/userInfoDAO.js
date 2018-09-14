const db = require('../models');

module.exports = {
  createUserInfo: (userInfoObj) => db.UserInfo.create(userInfoObj),
  findUserInfoByTenantId: (tenantId) => db.UserInfo.find({
    where: { tenantId, employeeId: null }
  }),
  updateUserInfoByTenantId: (userInfoObj, tenantId) => db.UserInfo.update(userInfoObj, {
    where: { tenantId, employeeId: null },
    returning: true
  })
}