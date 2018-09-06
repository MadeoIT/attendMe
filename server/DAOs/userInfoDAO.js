const db = require('../models');

module.exports = {
  createUserInfo: (userInfoObj) => db.UserInfo.create(userInfoObj)
}