const router = require('express').Router();

const {
  authenticate,
  isRefreshTokenValid,
  isConfirmationTokenValid,
  isResetTokenValid
} = require('../middleware/auth');

const {
  sendConfirmationEmail,
  sendResetPasswordEmail,
  sendWelcomeEmail,
  sendResetPasswordConfirmationEmail
} = require('../Services/notificationService');

const {
  sendTokenAndRefreshToken,
  sendToken
} = require('../Services/authService');

const {
  checkTenantEmail,
  saveTenant
} = require('../Services/tenantService');

//Sign up a new tenant and send verification email
router.post('/signup', saveTenant('local'), sendConfirmationEmail);

//Confirm account
router.get('/signup/:tokenId', isConfirmationTokenValid, sendWelcomeEmail);

//login and give back a token
router.post('/login', authenticate, sendTokenAndRefreshToken);

//Check is the refresh token is valid and give back a new token
router.post('/relogin', isRefreshTokenValid, sendToken);

//Send email for password reset
router.post('/password', checkTenantEmail , sendResetPasswordEmail);

//Reset password
router.post('/password/:tokenId', isResetTokenValid, sendResetPasswordConfirmationEmail);

//Sign up a new tenant with Google Auth


module.exports = router;