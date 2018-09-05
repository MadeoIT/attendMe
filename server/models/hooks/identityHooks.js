const { generateSalt, hashPassword } = require('../../utils/encryption');
const R = require('ramda');

const identityHooks = {
  getHashedPassword: (password) => R.pipeP(
    generateSalt,
    hashPassword(password)
  )(),

  beforeCreateIdentity: async (identity, options) => {
    if(identity.googleId || identity.facebookId) return;
    if(!identity.password) throw new Error('Password is required');

    const hashedPassword = await identityHooks.getHashedPassword(identity.password);

    identity.password = hashedPassword;
  }
}

module.exports = identityHooks;