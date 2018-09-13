const { generateSalt, hashPassword } = require('../../utils/encryption');
const R = require('ramda');

const identityHooks = {
  getHashedPassword: (password) => R.pipeP(
    generateSalt,
    hashPassword(password)
  )(),

  beforeCreateIdentity: async (identity, options) => {
    if(identity.googleId || identity.facebookId) return;
    if(!identity.password) throw { status: 400, message: 'Password is required'};

    const hashedPassword = await identityHooks.getHashedPassword(identity.password);

    identity.password = hashedPassword;
  },

  beforeUpdateIdentity: async (identity, options) => {
    if(identity.googleId || identity.facebookId) {
      throw { status: 400, message: 'You cannot update password for this email' }
    };
    if(!identity.password) throw { status: 400, message: 'Password is required'};

    const hashedPassword = await identityHooks.getHashedPassword(identity.password);

    identity.password = hashedPassword;
  }
}

module.exports = identityHooks;