const bcrypt = require('bcryptjs');

const generateSalt = (saltRounds) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) return reject(err);

      return resolve(salt);
    });
  })
};

const hashPassword = (password, salt) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) return reject(err);

      return resolve(hash);
    })
  })
};

const comparePassword = (password, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, res) => {
      if (err) return reject(err);

      return resolve(res); //Return a boolean
    })
  })
};

module.exports = {
  comparePassword,
  hashPassword,
  generateSalt
}