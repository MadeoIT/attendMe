const router = require('express').Router();
const { isValid, googleScope } = require('../middleware/auth');
const authService = require('../Services/authService');
const { geolocationService } = require('../Services/geoLocationService');

//Sign up a new tenant and send verification email
router.post('/signup', authService.signup);

//Confirm account
router.get('/signup/:tokenId', isValid('jwt-confirm'), authService.confirmAccount);

//login and give back a token
router.post('/login', isValid('local'), geolocationService, authService.sendTokenAndRefreshToken);

//Check is the refresh token is valid and give back a new token
router.post('/relogin', isValid('jwt-refresh'), authService.sendToken);

//Password reset / Send message
router.post('/password', isValid('email'), authService.mailPasswordReset);

//Password reset / Save new passowrd
router.post('/password/:tokenId', isValid('jwt-confirm'), authService.resetPassowrd);

//Sign up a new tenant with Google Auth
router.get('/google', googleScope);
router.post('/google/callback', isValid('google'));

module.exports = router;