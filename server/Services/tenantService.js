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

  //Todo: add validation

  const identity = await identityDAO.findIdentityByEmail(identityObj.email);

  if (identity) throw { status: 400, message: 'Email already exist'};
  
  const savedTenant = await tenantDAO.createTenant();
  identityObj.tenantId = savedTenant.id;
  addressObj.tenantId = savedTenant.id;
  userInfoObj.tenantId = savedTenant.id;

  const result = await Promise.all([
    identityDAO.createIdentity(identityObj),
    userInfoDAO.createUserInfo(userInfoObj),
    addressDAO.createAddress(addressObj)
  ]);
  
  return tenantDTO.tenantToTenantDTO( 
    ...[].concat(result.map(data => data.toJSON())), 
    savedTenant.toJSON()
  );
};

/**
 * Update tenant associated properties
 * @param {Object} tenant 
 * @param {Number} tenantId 
 */
const updateTenant = async (tenant, tenantId) => {
  const { identityObj, addressObj, userInfoObj } = tenantDTO.tenantDTOtoTenant(tenant);

  const result = await Promise.all([
    identityDAO.updateIdentityByTenantId(identityObj, tenantId),
    userInfoDAO.updateUserInfoByTenantId(userInfoObj, tenantId),
    addressDAO.updateAddressByTenantId(addressObj, tenantId),
    tenantDAO.findTenantById(tenantId)
  ])
  
  return tenantDTO.tenantToTenantDTO(
    result[0][1][0].toJSON(),
    result[1][1][0].toJSON(),
    result[2][1][0].toJSON(),
    result[3].toJSON()
  )
};

/**
 * It check whether the tenant exist in the database
 * @param {String} email 
 * @param {Function} done 
 * This function is used by passportJs middleware
 */
const getTenantByEmail = async (payload, done) => {
  try {
    const tenantId = payload.id;
    const identity = await identityDAO.findIdentityByEmail(payload.email);
    
    if (!identity) return done({ status: 404, message: 'Email does not exist' }, false);

    const result = await Promise.all([
      userInfoDAO.findUserInfoByTenantId(tenantId),
      addressDAO.findAddressByTenantId(tenantId),
      tenantDAO.findTenantById(tenantId)
    ]);

    const tenant = tenantDTO.tenantToTenantDTO(
      identity.toJSON(),
      ...[].concat(result.map(data => data.toJSON()))
    )
    
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
  checkTenantCredential,
  getTenantByEmail,
  updateTenant
}