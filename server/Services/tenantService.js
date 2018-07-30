const tenantDAO = require('../DAOs/tenantDAO');
const bcrypt = require('bcryptjs');
const config = require('config');
const { changeObjectKeyValue } = require('../factory');
const { tenantToTenantDTO } = require('../DTOs/tenantDTO');

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

      return resolve(res); //Return a boolean
    })
  })
};

const saveTenant = async (tenantObj) => {
  try {
    const { password, email } = tenantObj;
    const tenant = await tenantDAO.findTenantByEmail(email);
    
    if(tenant) return false;
    
    const salt = await generateSalt(saltRounds);
    const hashedPassword = await hashPassword(password, salt);
    const newTenantObj = changeObjectKeyValue(tenantObj, 'password', hashedPassword);  
    
    return await tenantDAO.createTenant(newTenantObj);

  } catch (error) {
    throw new Error(error);
  }
};

const validateTenant = async (email, password, done) => {
  try {
    const tenant = await tenantDAO.findTenantByConfirmedEmail(email);
    
    if(!tenant) return done(null, false);
    const res = await comparePassword(password, tenant.password);

    if(!res) return done(null, false);
    return done(null, tenant);

  } catch (error) {
    return done(error);
  }
};

const validateTenantJwt = async (payload, done) => {
  try {
    const tenant = await tenantDAO
      .findTenantByIdAndEmail(payload.sub, payload.name);
  
    if(!tenant) return done(null, false);

    return done(null, tenant);

  } catch (error) {
    done(error, false);
  }
}

module.exports = {
  saveTenant,
  validateTenant,
  validateTenantJwt,
  generateSalt,
  hashPassword
}