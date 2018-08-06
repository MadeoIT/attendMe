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
  getPasswordObj: async (tenant) => {
    const salt = await generateSalt(saltRounds);
    const hashedPassword = await hashPassword(tenant.password, salt);
    return changeObjectKeyValue(tenant, 'password', hashedPassword);
  },
  getGoogleObj: async (tenant) => {
    return { 
      password: '',
      googleId: tenant.id,
      email: tenant.email
    }
  },
  getConfirmedObj: async () => {
    return { confirmed: true }
  },
  getTenantObj: async (tenant) => tenant
};

/**
 * Persist Tenant into the database
 * @param {Object} tenant 
 * @param {Function} getObject 
 * Create the tenant object, validate the tenant object, 
 * check if tenant already exist, persist the tenant
 */
const saveTenant = async (tenant, getObject) => {
  const tenantObj = await getObject(tenant);
  const result = Joi.validate(tenantObj, tenantSchema);

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

  return await tenantDAO.createTenant(tenantObj);
};

const updateTenant = async (tenant, getObject, id) => {
  const tenantObj = await getObject(tenant);
  const result = await tenantDAO.updateTenantById(tenantObj, id);
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