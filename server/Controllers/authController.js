const router = require('express').Router();
const { isLogged, isRefreshTokenValid } = require('../middleware/auth');
const authService = require('../Services/authService');

//Sign up a new tenant and send verification email
router.post('/signup', authService.signUp);

//Confirm account
router.get('/confirm/:tokenId', authService.confirmEmail);

//login and give back a token
router.post('/login', isLogged, authService.logIn);

//Check is the refresh token is valid and give back a new token
router.post('/relogin', isRefreshTokenValid, authService.reLogIn);

module.exports = router;