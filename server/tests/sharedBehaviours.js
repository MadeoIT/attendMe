const db = require('../models');
const {
  createPayload,
  createToken
} = require('../utils/token');
const config = require('config');
const {
  generateSalt,
  hashPassword
} = require('../utils/encryption');

const uuidv4 = require('uuid/v4');

const tokenKey = config.get('encryption.jwtSk');
const refreshTokenKey = config.get('encryption.jwtRefreshSk');
const confirmationTokenKey = config.get('encryption.jwtConfirmationSk');

const tokenExp = config.get('encryption.tokenExp');
const refreshTokenExp = config.get('encryption.refreshTokenExp');
const confirmationTokenExp = config.get('encryption.confirmationTokenExp');


exports.generateTokenAndCsrfToken = function (tenant) {
  const csrfToken = uuidv4();
  const payload = createPayload(tenant, csrfToken);
  const token = createToken(payload, tokenKey, tokenExp);

  return {
    csrfToken,
    token
  }
};

exports.generateRefreshTokenAndCsrfToken = function (tenant) {
  const csrfToken = uuidv4();
  const payload = createPayload(tenant, csrfToken);
  const refreshToken = createToken(payload, refreshTokenKey, refreshTokenExp);

  return {
    csrfToken,
    refreshToken
  }
};

exports.generateConfirmationToken = function (tenant) {
  const payload = createPayload(tenant, '');
  return createToken(payload, confirmationTokenKey, confirmationTokenExp);
}

exports.generateTenant = async function (tenantObj) {
  const salt = await generateSalt();
  const hashedPassword = await hashPassword(tenantObj.password, salt);
  return db.Tenant.create({
    email: tenantObj.email,
    password: hashedPassword,
    confirmed: true
  });
};

exports.generateTenantObj = () => ({
  email: 'email@email.com',
  password: 'password',

  streetAddress: 'address 28 A',
  postCode: '28103',
  country: 'Finland',

  firstName: 'name',
  lastName: 'lastName',
  userName: 'userName'
});
exports.generateTenantObjGoogle = () => ({
  email: 'email@gmail.com',
  googleId: 'googleId',

  streetAddress: 'address 28 A',
  postCode: '28103',
  country: 'Finland',

  firstName: 'name',
  lastName: 'lastName',
  userName: 'userName'
});
exports.generateTenantFromDb = () => ({
  id: 1,
  numberOfEmployes: 20
});
exports.generateAddressFromDb = (fk) => ({
  id: 4,
  tenantId: 1,
  employeeId: fk ? 2 : null,
  streetAddress: 'address 28 A',
  postCode: '28103',
  country: 'Finland'
});
exports.generateIdentityFromDb = (fk) => ({
  id: 32,
  tenantId: 1,
  employeeId: fk ? 2 : null,
  email: 'email@email.com',
  password: 'password'
});
exports.generateUserInfoFromDb = (fk) => ({
  id: 23,
  tenantId: 1,
  employeeId: fk ? 2 : null,
  firstName: 'name',
  lastName: 'lastName',
  userName: 'userName'
});