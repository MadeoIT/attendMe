const router = require('express').Router();
const { isLogged } = require('../middleware/auth');
const authService = require('../Services/authService');

router.post('/signup');

router.post('/login', isLogged, authService.signIn);

module.exports = router