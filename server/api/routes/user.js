const express = require('express');
const router = express.Router();

const { patch_password, patch_email, patch_username, get_user } = require('../controllers/user');
const { isAdmin } = require('../middlewares/auth');

router.patch('/password', patch_password);

router.patch('/email', patch_email);

router.patch('/username', patch_username);

router.get('/', isAdmin, get_user);

module.exports = router;