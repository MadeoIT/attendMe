const db = require('../models');

module.exports = {
  createUserInfo: (userInfoObj) => db.UserInfo.create(userInfoObj),
  findUserInfoByTenantId: (tenantId) => db.UserInfo.find({
    where: { tenantId }
  }),
  updateUserInfoByTenantId: (userInfoObj, tenantId) => db.UserInfo.update(userInfoObj, {
    where: { tenantId },
    returning: true
  })
}