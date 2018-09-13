const passport = require('passport');
const { googleAuth } = require('./authGoogle');
const { Strategy: JwtStrategy } = require('passport-jwt');
const LocalStrategy = require('passport-local');
const { checkTenantCredential, getTenantByEmail } = require('../Services/tenantService');
const config = require('config');

//Custom Token extractors
const cookieTokenExtractor = function (req) {
  let token;
  if(req && req.cookies) return token = req.cookies['token'];

  return token;
};

const cookieRefreshTokenExtractor = function (req) {
  let refreshToken;
  if(req && req.cookies) return refreshToken = req.cookies['refresh-token'];

  return refreshToken;
};

const urlTokenExtractor = function (req) {
  let token;
  if(req && req.params) return token = req.params.tokenId;

  return token;
}

//Strategy Options
const localOption = {
  usernameField: 'email'
};
const localEmailOption =  {
  usernameField: 'email',
  passwordField: 'email',
}
const jwtOption = {
  jwtFromRequest: cookieTokenExtractor, //Custom extractor from cookie
  secretOrKey: config.get('encryption.jwtSk'),
  passReqToCallback: true //Allow request object in the callback
};

//Check the tenant credentials
const login = new LocalStrategy(localOption, async(username, password, done) => {
  await checkTenantCredential(username, password, done);
});

//Check if tenant email is valid. "username" is equal to "email", see the config object
const email = new LocalStrategy(localEmailOption, async(username, _, done) => {
  await getTenantByEmail(username, done);
});

//Check if token is valid and compare it with csrf token
const jwtAuth = new JwtStrategy(jwtOption, async(req, payload, done) => {
  const csrfToken = req.headers['csrf-token'];

  if(csrfToken !== payload.csrfToken) return done(null, false); //verify csrf token

  return done(null, payload);
});

const options = {
  jwtConfirmation: {
    jwtFromRequest: urlTokenExtractor,
    secretOrKey: config.get('encryption.jwtConfirmationSk'),
    passReqToCallback: true 
  },
  jwtRefresh: {
    jwtFromRequest: cookieRefreshTokenExtractor,
    secretOrKey: config.get('encryption.jwtRefreshSk'),
    passReqToCallback: true
  }
};

/**
 * Build a strategy injecting the options required
 * @param {String} strategyType type of the strategy
 * @returns {Object} Return a strategy object
 * Avoid code duplications for similar strategy
 * This function validate any jwt token and check if the tenant/user email exists
 */
const jwtOptionalStrategyBuilder = (strategyType) => {
  return new JwtStrategy(options[strategyType], async(_, payload, done) => {
    const { email } = payload;

    await getTenantByEmail(email, done);
  });
};

//Middleware configurations
passport.use('local', login);
passport.use('email', email);
passport.use('jwt', jwtAuth);
passport.use('jwt-refresh', jwtOptionalStrategyBuilder('jwtRefresh'));
passport.use('jwt-confirm', jwtOptionalStrategyBuilder('jwtConfirmation'));
passport.use('jwt-reset', jwtOptionalStrategyBuilder('jwtConfirmation'));
passport.use('google', googleAuth);

/**
 * Get an validation method
 * @param {String} validationStrategy name of the strategy. Ex: 'jwt', 'email'
 * @returns {Function} return an authentication function
 */
const isValid = (validationStrategy) => {
  return passport.authenticate(validationStrategy, {session: false})
}

const googleScope = passport.authenticate('google', { scope: ['profile', 'email'] });

module.exports = {
  isValid,
  googleScope
}