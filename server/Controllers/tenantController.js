const router = require('express').Router();
const { isValid } = require('../middleware/auth');
const tenantService = require('../Services/tenantService');

router.get('/:tenantId', isValid('jwt'), tenantService.getTenant)

module.exports = router;