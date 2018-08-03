const router = require('express').Router();
const { isValid, googleScope } = require('../middleware/auth');
const { middlewareComposer, endMiddleware } = require('../factory');
const { sendNotification } = require('../Services/notificationService');
const { sendTokenAndRefreshToken, sendToken } = require('../Services/authService');
const { saveTenant, updateTenant } = require('../Services/tenantService');

//Sign up a new tenant and send verification email
router.post('/signup', 
  saveTenant('local'), 
  middlewareComposer(sendNotification('confirmation')),
  endMiddleware()
);

//Confirm account
router.get('/signup/:tokenId', 
  isValid('jwt-confirm'), 
  updateTenant('confirmed'), 
  middlewareComposer(sendNotification('welcome')),
  endMiddleware()
);

//login and give back a token
router.post('/login', isValid('local'), sendTokenAndRefreshToken);

//Check is the refresh token is valid and give back a new token
router.post('/relogin', isValid('jwt-refresh'), sendToken);

//Send email for password reset
router.post('/password', 
  isValid('email'), 
  middlewareComposer(sendNotification('resetPassword')),
  endMiddleware()
);

//Reset password
router.post('/password/:tokenId', 
  isValid('jwt-confirm'), 
  updateTenant('password'), 
  middlewareComposer(sendNotification('resetPasswordConfirmation')),
  endMiddleware()
);

//Sign up a new tenant with Google Auth
router.get('/google', googleScope);
router.post('/google/callback', 
  isValid('google'), 
  saveTenant('google'), 
  middlewareComposer(sendNotification('welcome')),
  endMiddleware()
);

module.exports = router;