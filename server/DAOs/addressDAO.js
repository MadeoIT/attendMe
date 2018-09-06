const db = require('../models');

module.exports = {
  createAddress: (addressObj) => db.Address.create(addressObj)
}