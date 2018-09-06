const tenantDAO = require('../DAOs/tenantDAO');
const identityDAO = require('../DAOs/identityDAO');
const addressDAO = require('../DAOs/addressDAO');
const userInfoDAO = require('../DAOs/userInfoDAO');
const tenantDTO = require('../DTOs/tenantDTO');

const { comparePassword } = require('../utils/encryption');

const R = require('ramda');

/**
 * Persist Tenant into the database
 * @param {Object} tenant 
 * @param {Function}
 */
const saveTenant = async (tenant) => {
  const { identityObj, addressObj, userInfoObj } = tenantDTO.tenantDTOtoTenant(tenant);

  const foundTenant = await tenantDAO.findTenantByEmail(identityObj.email);

  if (foundTenant) {
    return {
      result: false,
      message: 'Email already exist'
    }
  };

  const savedTenant = await tenantDAO.createTenant();
  identityObj.tenantId = savedTenant.id;
  addressObj.tenantId = savedTenant.id;
  userInfoObj.tenantId = savedTenant.id;

  return await Promise.all([
    identityDAO.createIdentity(identityObj),
    addressDAO.createAddress(addressObj),
    userInfoDAO.createUserInfo(userInfoObj)
  ]);
};

const saveTenantGoogle = async (tenant) => {
  const result = Joi.validate(tenant, tenantGoogleSchema);

  if (result.error) return;

  const foundTenant = await tenantDAO.findTenantByEmail(tenant.email);

  if (foundTenant) return foundTenant;

  tenant.confirmed = true;
  const savedTenant = await tenantDAO.createTenant(tenant);
  return savedTenant;
}

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

    if (!tenant) return done({ status: 404, message: 'Email does not exist' }, false);

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

    if (!tenant) return done({ status: 401, message: 'Invalid email or password' }, false)

    const res = await comparePassword(password, tenant.password);

    if (!res) return done({ status: 401, message: 'Invalid email or passoword' }, false);
    return done(null, tenant);

  } catch (error) {
    done(error);
  }
};


module.exports = {
  saveTenant,
  saveTenantGoogle,
  checkTenantCredential,
  getTenantByEmail,
  updateTenant
}