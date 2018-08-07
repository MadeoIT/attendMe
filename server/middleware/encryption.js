const config = require('config');
const bcrypt = require('bcryptjs');
const R = require('ramda');
const saltRounds = config.get('encryption.saltRounds');

const generateSalt = () => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) return reject(err);

      return resolve(salt);
    });
  })
};

const hashPassword = R.curry(
  (password, salt) => {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) return reject(err);

        return resolve(hash);
      })
    })
  }
);

const comparePassword = R.curry(
  (password, hash) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hash, (err, res) => {
        if (err) return reject(err);

        return resolve(res); //Return a boolean
      })
    })
  }
);

module.exports = {
  comparePassword,
  hashPassword,
  generateSalt
}