const db = require('../models');
const { createPayload, createToken } = require('../middleware/token');
const config = require('config');
const { generateSalt, hashPassword } = require('../middleware/encryption');
const faker = require('faker');

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
    csrfToken, token
  }
};

exports.generateRefreshTokenAndCsrfToken = function (tenant) {
  const csrfToken = uuidv4();
  const payload = createPayload(tenant, csrfToken);
  const refreshToken = createToken(payload, refreshTokenKey, refreshTokenExp);
  
  return {
    csrfToken, refreshToken
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

exports.generateFakeTenantObj = function () {
  return{
    email: faker.internet.email(),
    password: faker.internet.password(10)
  }
}

exports.generateFakeTodoObj = function () {
  return{
    content: faker.lorem.word()
  }
}