const { makePayload, createToken } = require('../middleware/token');
const config = require('config');
const { saveTenant } = require('../Services/tenantService');
const faker = require('faker');

const uuidv4 = require('uuid/v4');
const tokenKey = config.get('encryption.jwtSk');
const refreshTokenKey = config.get('encryption.jwtRefreshSk');
const tokenExp = config.get('encryption.tokenExp');
const refreshTokenExp = config.get('encryption.refreshTokenExp');

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

exports.generateTenant = function () {
  return saveTenant({
    email: faker.internet.email(),
    password: '123',
    confirmed: true
  });
};

exports.generateFakeTenantObj = function () {
  return{
    email: faker.internet.email(),
    password: faker.internet.password()
  }
}

exports.generateFakeTodoObj = function () {
  return{
    content: faker.lorem.word()
  }
}