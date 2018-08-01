const passport = require('passport');
const { GoogleStrategy: Strategy } = require('passport-google-oauth20');

const googleAuth = new GoogleStrategy();

passport.use(googleAuth);

const authenticateGoogle = passport.authenticate('google', { session: false });

module.exports = {
  authenticateGoogle
}