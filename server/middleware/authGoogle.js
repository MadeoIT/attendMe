const passport = require('passport');
const config = require('config');
const GoogleStrategy = require('passport-google-oauth20').Strategy

const clientID = config.get('googleAuth.clientID');
const clientSecret = config.get('googleAuth.clientSecret');
const callbackURL = config.get('googleAuth.callbackURL');

const googleAuth = new GoogleStrategy(
  { clientID, clientSecret, callbackURL }, 
  async (accessToken, refreshToken, profile, done) => {
    
    const body = {...profile};
    return done(null, body);
  }
);

passport.use('google', googleAuth);

module.exports = {
  googleAuth
}