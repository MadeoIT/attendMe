const db = require('../models');

module.exports = {
  findIdentityByEmail: (email) => db.Identity.find({
    where: { email }
  }),
  createIdentity: (identityObj) => db.Identity.create(identityObj)
}