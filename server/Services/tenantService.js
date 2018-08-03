const Joi = require('joi');
const config = require('config');

const tenantDAO = require('../DAOs/tenantDAO');
const { changeObjectKeyValue } = require('../factory');
const { tenantSchema } = require('../models/validationModels/tenantValidation');
const saltRounds = config.get('encryption.saltRounds');
const { comparePassword, generateSalt, hashPassword } = require('../middleware/encryption');

/**
 * Object that contains method to output tenant object
 * @param {Object} tenant
 * @returns {Object} tenant object
 * Those object can be used to update or persist
 */
const tenantObjects = {
  password: async (tenant) => {
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
  confirmed: async () => {
    return { confirmed: true }
  }
};

//Validate tenant object check if tenant email already exist and then persist
const saveTenant = async (tenant) => {
  const result = Joi.validate(tenant, tenantSchema);

  if(result.error) {
    return { 
      result: false, 
      message: result.error.details[0].message 
    }
  };
  
  const foundTenant = await tenantDAO.findTenantByEmail(tenant.email);

  if (foundTenant) {
    return { 
      result: false, 
      message: 'Email already exist'
    }
  }

  return await tenantDAO.createTenant(tenant);
};

const updateTenant = async (tenant, id) => {
  const result = await tenantDAO.updateTenantById(tenant, id);
  return result[1][0]; //Postgre returning object
};

/**
 * It check whether the tenant exist in the database
 * @param {String} email 
 * @param {Function} done 
 * This function is used by passportJs middleware
 */
const getTenantByEmail = async (email, done) => {
  try {

    const tenant = await tenantDAO.findTenantByEmail(email);

    if (!tenant) return done(null, false);

    return done(null, tenant);

  } catch (error) {
    done(error)
  }
};

/**
 * Check email and password of the tenant
 * @param {String} email 
 * @param {String} password 
 * @param {Function} done 
 * This function is used by passportJs middleware
 */
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


module.exports = {
  saveTenant,
  checkTenantCredential,
  getTenantByEmail,
  updateTenant,
  tenantObjects
}