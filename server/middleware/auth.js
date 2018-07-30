const passport = require('passport');
const { Strategy: JwtStrategy } = require('passport-jwt');
const LocalStrategy = require('passport-local');
const { validateTenant, validateTenantJwt } = require('../Services/tenantService');
const config = require('config');
const { changeObjectKeyName } = require('../factory');

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

const localOption = {
  usernameField: 'email'
};
const jwtOption = {
  jwtFromRequest: cookieTokenExtractor, //Custom extractor from cookie
  secretOrKey: config.get('encryption.jwtSk'),
  passReqToCallback: true //The allow request object in the callback
};
const jwtRefreshOption = {
  jwtFromRequest: cookieRefreshTokenExtractor, //Custom extractor from cookie
  secretOrKey: config.get('encryption.jwtRefreshSk'),
  passReqToCallback: true //The allow request object in the callback
};

const login = new LocalStrategy(localOption, async(username, password, done) => {
  await validateTenant(username, password, done);
});

const jwtAuth = new JwtStrategy(jwtOption, async(req, payload, done) => {
  const csrfToken = req.headers['authorization'];
  if(csrfToken !== payload.csrfToken) return done(null, false); //verify csrf token

  const newPayload = changeObjectKeyName(payload, 'sub', 'id');

  return done(null, newPayload);
});

//Check if the refresh token is valid
const jwtRefreshAuth = new JwtStrategy(jwtRefreshOption, async(req, payload, done) => {
  const csrfToken = req.headers['authorization'];
 
  if(csrfToken !== payload.csrfToken) return done(null, false); //verify csrf token

  await validateTenantJwt(payload, done); //If verified validate the tenant
})


passport.use(login);
passport.use(jwtAuth);
passport.use('jwt-refresh', jwtRefreshAuth);

const isLogged = passport.authenticate('local', {session: false});
const isAuthenticated = passport.authenticate('jwt', {session: false});
const isRefreshTokenValid = passport.authenticate('jwt-refresh', {session: false});


module.exports = {
  isLogged,
  isAuthenticated,
  isRefreshTokenValid
}

