const tenantDAO = require('../DAOs/tenantDAO');
const bcrypt = require('bcryptjs');
const config = require('config');
const { changeObjectKeyValue } = require('../factory');
const { isTenantObjectNotValid } = require('../models/validationModels/tenantValidation');
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

/**
 * Object with different saving method
 * @returns {Object} return an object to be saved depending on the method
 */
const savingMethod = {
  local: async (tenant) => {
    const salt = await generateSalt(saltRounds);
    const hashedPassword = await hashPassword(tenant.password, salt);
    return changeObjectKeyValue(tenant, 'password', hashedPassword); 
  },
  google: async (tenant) => {
    return tenant;
  },
  facebook: async (tenant) => {
    return tenant;
  }
};

/**
 * Save a tenant or user depending on the chosen method
 * @param {string} method the method should be 'google', 'local, 'facebook'
 * @returns {Function} middleware function
 */
const saveTenant = (method) => {
  return async (req, res, next) => {
    try {
      const { body } = req;
  
      if(isTenantObjectNotValid(body)){
        const message = isTenantObjectNotValid(body);
        return res.status(400).send(message);
      };
  
      const { email } = body;
      const foundTenant = await tenantDAO.findTenantByEmail(email);
      
      if(foundTenant) return res.status(400).send('Email already exist');
      
      const tenantObj = await savingMethod[method](body); //Inject the method in the controller
      
      const savedTenant = await tenantDAO.createTenant(tenantObj);
      req.user = savedTenant;
      next();
  
    } catch (error) {
      next(error);
    }
  };
}

const attributeType = {
  emailAndPassword: {

  },
  token: {

  },
  email: {

  }
}

const checkTenant = (type, ...args) => {
  return async (args) => {
    try {
      
    } catch (error) {
      done(error)
    }
  }
}

const checkTenantCredential = async (email, password, done) => {
  try {
    const tenant = await tenantDAO.findTenantByEmailAndConfirmed(email);
    
    if(!tenant) return done(null, false)

    const res = await comparePassword(password, tenant.password);

    if(!res) return done(null, false);
    return done(null, tenant);

  } catch (error) {
    done(error);
  }
};

const checkTenantToken = async (payload, done) => {
  try {
    const tenant = await tenantDAO.findTenantByIdAndEmail(payload.sub, payload.name);
  
    if(!tenant) return done(null, false);

    return done(null, tenant);

  } catch (error) {
    done(error, false);
  }
};

const checkTenantEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const tenant = await tenantDAO.findTenantByEmail(email);
    if(!tenant) return res.status(404).send('Email is not found');

    req.user = tenant;
    next();

  } catch (error) {
    next(error);
  }
};

const confirmTenantEmail = async (payload, done) => {
  try {
    const tenantObj = { confirmed: true };
    const result = await tenantDAO.updateTenantById(tenantObj, payload.sub);
    const tenant = result[1][0]; //Postgre returning object
    if(!tenant) return done(null, false);
    
    return done(null, tenant);

  } catch (error) {
    done(error);
  }
};

const resetTenantPassword = async (req, payload, done) => {
  try {
    const { password } = req.body;
    const salt = await generateSalt(saltRounds);
    const hashedPassword = await hashPassword(password, salt);
    const tenantObj = { password: hashedPassword };
    const result = await tenantDAO.updateTenantById(tenantObj, payload.sub);
    const tenant = result[1][0]; //Postgre returning object
    
    if(!tenant) return done(null, false);

    return done(null, tenant);

  } catch (error) {
    done(error);
  }
};

module.exports = {
  saveTenant,
  checkTenantCredential,
  checkTenantToken,
  confirmTenantEmail,
  resetTenantPassword,
  checkTenantEmail,
  generateSalt,
  hashPassword
}