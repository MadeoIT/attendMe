const passport = require('passport');
const { Strategy: JwtStrategy } = require('passport-jwt');
const LocalStrategy = require('passport-local');
const { checkTenantCredential, checkTenantToken, confirmTenantEmail, resetTenantPassword } = require('../Services/tenantService');
const config = require('config');
const { changeObjectKeyName } = require('../factory');

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
const jwtOption = {
  jwtFromRequest: cookieTokenExtractor, //Custom extractor from cookie
  secretOrKey: config.get('encryption.jwtSk'),
  passReqToCallback: true //The allow request object in the callback
};
const jwtRefreshOption = {
  jwtFromRequest: cookieRefreshTokenExtractor,
  secretOrKey: config.get('encryption.jwtRefreshSk'),
  passReqToCallback: true
};
const jwtConfirmationOptions = {
  jwtFromRequest: urlTokenExtractor,
  secretOrKey: config.get('encryption.jwtConfirmationSk'),
  passReqToCallback: true 
}

//Strategy functions
const login = new LocalStrategy(localOption, async(username, password, done) => {
  await checkTenantCredential(username, password, done);
});

const jwtAuth = new JwtStrategy(jwtOption, async(req, payload, done) => {
  const csrfToken = req.headers['authorization'];
  if(csrfToken !== payload.csrfToken) return done(null, false); //verify csrf token

  const newPayload = changeObjectKeyName(payload, 'sub', 'id');

  return done(null, newPayload);
});

const jwtRefreshAuth = new JwtStrategy(jwtRefreshOption, async(req, payload, done) => {
  const csrfToken = req.headers['authorization'];
 
  if(csrfToken !== payload.csrfToken) return done(null, false); //verify csrf token

  await checkTenantToken(payload, done); //If verified validate the tenant
});

const jwtConfirmationAuth = new JwtStrategy(jwtConfirmationOptions , async (_, payload, done) => {
  await confirmTenantEmail(payload, done);
});

const jwtResetPasswordAuth = new JwtStrategy(jwtConfirmationOptions, async (req, payload, done) => {
  await resetTenantPassword(req, payload, done);
});


//Middleware configurations
passport.use(login);
passport.use(jwtAuth);
passport.use('jwt-refresh', jwtRefreshAuth);
passport.use('jwt-confirm', jwtConfirmationAuth);
passport.use('jwt-reset', jwtResetPasswordAuth);

const authenticate = passport.authenticate('local', {session: false});
const isAuthenticated = passport.authenticate('jwt', {session: false});
const isRefreshTokenValid = passport.authenticate('jwt-refresh', {session: false});
const isConfirmationTokenValid = passport.authenticate('jwt-confirm', {session: false});
const isResetTokenValid = passport.authenticate('jwt-reset', {session: false});

module.exports = {
  authenticate,
  isAuthenticated,
  isRefreshTokenValid,
  isConfirmationTokenValid,
  isResetTokenValid
}