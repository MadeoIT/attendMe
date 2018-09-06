const db = require('../models');

module.exports = {
  createIdentity: (identityObj) => db.Identity.create(identityObj)
}