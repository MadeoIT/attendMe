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
 * Return value from a create method in sequelize is a full entity
 * toJSON transform the entity in the data that we need
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
 * result[0] is the first obj coming from the Promise.all 
 * result[0][1][0] is the way to access the special "returning obj" provided by PostGres
 * after update operation
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
 * @param {Object} payload payload from token 
 * @param {Function} done passportJs function done(error, object)
 * This function is used by passportJs middleware
 */
const getTenantByEmail = async (email, done) => {
  try {
    const identity = await identityDAO.findIdentityByEmail(email);
    
    if (!identity) return done({ status: 404, message: 'Email does not exist' }, false);

    const { tenantId } = identity;

    const result = await Promise.all([
      userInfoDAO.findUserInfoByTenantId(tenantId),
      addressDAO.findAddressByTenantId(tenantId),
      tenantDAO.findTenantById(tenantId)
    ]);

    const tenant = tenantDTO.tenantToTenantDTO(
      identity.toJSON(),
      ...[].concat(result.map(data => data.toJSON()))
    );
    
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
    const identity = await identityDAO.findIdentityByEmail(email);

    if (!identity) return done({ status: 401, message: 'Invalid email or password' }, false)

    const doesPasswordMatch = await comparePassword(password, identity.password);

    if (!doesPasswordMatch) return done({ status: 401, message: 'Invalid email or passoword' }, false);

    const { tenantId } = identity;

    const result = await Promise.all([
      userInfoDAO.findUserInfoByTenantId(tenantId),
      addressDAO.findAddressByTenantId(tenantId),
      tenantDAO.findTenantById(tenantId)
    ]);

    const tenant = tenantDTO.tenantToTenantDTO(
      identity.toJSON(),
      ...[].concat(result.map(data => data.toJSON()))
    );

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