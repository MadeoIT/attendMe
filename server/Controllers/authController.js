const router = require('express').Router();
const { isValid, googleScope } = require('../middleware/auth');
const authService = require('../Services/authService');

//Signup a new tenant and send confirmation email
router.post('/api/auth/signup', authService.signup);

//TODO: Resend confirmation email
router.post('/api/auth/signup/resend', isValid('email'), authService.resendConfirmationEmail)

//Confirm account
router.get('/api/auth/signup/:tokenId', isValid('jwt-confirm'), authService.confirmAccount);

//Login and give back a token
router.post('/api/auth/login', isValid('local'), authService.login);

//Logout
router.post('/api/auth/logout', isValid('jwt'), authService.logout);

//Check is the refresh token is valid and give back a new token
router.post('/api/auth/relogin', isValid('jwt-refresh'), authService.relogin);

//Password reset / Send message
router.post('/api/auth/password', isValid('email'), authService.mailPasswordReset);

//TODO: Password reset / Save new passowrd
router.post('/api/auth/password/:tokenId', isValid('jwt-confirm'), authService.resetPassowrd);

//TODO: Sign up a new tenant with Google Auth
router.get('/auth/google', googleScope);
router.get(
  '/auth/google/callback', 
  isValid('google'), 
  authService.signupGoogle,
  authService.loginGoogle,
  (req, res) => res.redirect(`/google/welcome/${req.csrfToken}`)
);

module.exports = router;