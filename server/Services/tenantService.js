const tenantDAO = require('../DAOs/tenantDAO');
const config = require('config');
const { changeObjectKeyValue } = require('../factory');
const { isTenantObjectNotValid } = require('../models/validationModels/tenantValidation');
const saltRounds = config.get('encryption.saltRounds');
const { comparePassword, generateSalt, hashPassword } = require('../middleware/encryption');

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
    return { 
      password: '',
      googleId: tenant.id,
      email: tenant.email
    }
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

      if (isTenantObjectNotValid(body)) {
        const message = isTenantObjectNotValid(body);
        return res.status(400).send(message);
      };

      const { email } = body;
      const foundTenant = await tenantDAO.findTenantByEmail(email);

      if (foundTenant) {
        return res.status(400).send('Email already exist');
      };

      const tenantObj = await savingMethod[method](body);
      const savedTenant = await tenantDAO.createTenant(tenantObj);

      req.user = savedTenant;
      next();

    } catch (error) {
      next(error);
    }
  };
};

const getTenantByEmail = async (email, done) => {
  try {

    const tenant = await tenantDAO.findTenantByEmail(email);

    if (!tenant) return done(null, false);

    return done(null, tenant);

  } catch (error) {
    done(error)
  }
};

const fields = {
  password: async (req) => {
    const salt = await generateSalt(saltRounds);
    const hashedPassword = await hashPassword(req.body.password, salt);
    return { password: hashedPassword }
  },
  confirmed: async (req) => {
    return { confirmed: true }
  },
  tenant: async (req) => req.body
}

const updateTenant = (fieldToUpdate) => {
  return async (req, res, next) => {
    try {

      const { id } = req.user;

      const tenantObj = await fields[fieldToUpdate](req);

      const result = await tenantDAO.updateTenantById(tenantObj, id);

      const tenant = result[1][0]; //Postgre returning object

      req.user = tenant

      next();

    } catch (error) {
      next(error);
    }
  }
}

const checkTenantCredential = async (email, password, done) => {
  try {
    const tenant = await tenantDAO.findTenantByEmailAndConfirmed(email);

    if (!tenant) return done(null, false)

    const res = await comparePassword(password, tenant.password);

    if (!res) return done(null, false);
    return done(null, tenant);

  } catch (error) {
    done(error);
  }
};

const updateTenantTest = async (tenantObj) => {
  const result = await tenantDAO.updateTenantById(tenantObj, id);
  return result[1][0]; //Postgre returning object
}

module.exports = {
  saveTenant,
  checkTenantCredential,
  getTenantByEmail,
  updateTenant,

  updateTenantTest
}