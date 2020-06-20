const express = require('express');
const router = express.Router();

const { isAdmin } = require('../middlewares/auth');
const { auth_signup, auth_login, auth_create } = require('../controllers/auth');

router.post('/signup', auth_signup);
router.post('/create', isAdmin, auth_create)
router.post('/login', auth_login);

module.exports = router;