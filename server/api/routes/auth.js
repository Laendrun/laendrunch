const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/auth');

router.post('/signup', AuthController.auth_signup);
router.post('/login', AuthController.auth_login);

module.exports = router;