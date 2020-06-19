const express = require('express');
const router = express.Router();

const { auth_signup, auth_login } = require('../controllers/auth');

router.post('/signup', auth_signup);
router.post('/login', auth_login);

module.exports = router;