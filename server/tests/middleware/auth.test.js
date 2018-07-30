const { isAuthenticated } = require('../../middleware/auth');
const db = require('../../models');
const config = require('config');
const { generateTenant, generateTokenAndCsrfToken } = require('../sharedBehaviours')

describe('auth', () => {
  const PASSWORD = '123';
  const EMAIL = 'matteo@gmail.com';
  let token;

  beforeEach(async() => {
    
  });

  it('should verify that the refresh token is valid', async() => {

  });

})