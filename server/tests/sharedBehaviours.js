const db = require('../models');
const { makePayload, createToken } = require('../middleware/token');
const config = require('config');
const { generateSalt, hashPassword } = require('../Services/tenantService');
const faker = require('faker');

const uuidv4 = require('uuid/v4');

const tokenKey = config.get('encryption.jwtSk');
const refreshTokenKey = config.get('encryption.jwtRefreshSk');
const confirmationTokenKey = config.get('encryption.jwtConfirmationSk');

const tokenExp = config.get('encryption.tokenExp');
const refreshTokenExp = config.get('encryption.refreshTokenExp');
const confirmationTokenExp = config.get('encryption.confirmationTokenExp');

const saltRounds = config.get('encryption.saltRounds');

exports.generateTokenAndCsrfToken = function (tenant) {
  const csrfToken = uuidv4();
  const payload = makePayload(tenant, csrfToken);
  const token = createToken(payload, tokenKey, tokenExp);
  return {
    csrfToken, token
  }
};

exports.generateRefreshTokenAndCsrfToken = function (tenant) {
  const csrfToken = uuidv4();
  const payload = makePayload(tenant, csrfToken);
  const refreshToken = createToken(payload, refreshTokenKey, refreshTokenExp);
  return {
    csrfToken, refreshToken
  }
};

exports.generateConfirmationToken = function (tenant) {
  const payload = makePayload(tenant);
  return createToken(payload, confirmationTokenKey, confirmationTokenExp);
}

exports.generateTenant = async function (tenantObj) {
  const salt = await generateSalt(saltRounds);
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