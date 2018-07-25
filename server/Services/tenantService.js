const tenantDAO = require('../DAOs/tenantDAO');
const bcrypt = require('bcryptjs');
const config = require('config');

//Configuration constants
const saltRounds = config.get('encryption.saltRounds');

const generateSalt = (saltRounds) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if(err) return reject(err);

      return resolve(salt); 
    });
  })
};

const hashPassword = (password, salt) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, (err, hash) => {
      if(err) return reject(err);

      return resolve(hash);
    })
  })
};

const comparePassword = (password, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, res) => {
      if(err) return reject(err);

      return resolve(res);
    })
  })
};

const changeObjectProperty = (key, value, obj) => {
  const newObj = { ...obj };
  newObj[key] = value
  return newObj
};

const saveTenant = async (tenantObj) => {
  try {
    const { password } = tenantObj;
    const salt = await generateSalt(saltRounds);
    const hashedPassword = await hashPassword(password, salt);
    const newTenantObj = changeObjectProperty('password', hashedPassword, tenantObj);
   
    return await tenantDAO.createTenant(newTenantObj);

  } catch (error) {
    
  }
};

const validateTenant = async (email, password, done) => {
  try {
    const tenant = await tenantDAO.findTenantByEmail(email);
    
    if(!tenant) return done(null, false);
    const res = await comparePassword(password, tenant.password);

    if(!res) return done(null, false);
    return done(null, tenant);

  } catch (error) {
    return done(error);
  }
}

module.exports = {
  saveTenant,
  validateTenant
}