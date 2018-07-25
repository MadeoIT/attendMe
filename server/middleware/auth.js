const passport = require('passport');
const { ExtractJwt } = require('passport-jwt');
const { Strategy: JwtStrategy } = require('passport-jwt');
const LocalStrategy = require('passport-local');
const { validateTenant } = require('../Services/tenantService');

const db = require('../models');

const localOption = {
  usernameField: 'email'
}

const login = new LocalStrategy(localOption, async(username, password, done) => {
  await validateTenant(username, password, done);
});

//const jwtAuth = new JwtStrategy();

passport.use(login);
//passport.use(jwtAuth);

const isLogged = passport.authenticate('local', {session: false});
//const isAuthenticated = passport.authenticate('jwt', {session: false});

module.exports = {
  isLogged
}

