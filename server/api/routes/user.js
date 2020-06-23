const express = require('express');
const router = express.Router();

const { patch_password, patch_email, patch_username, get_user, get_user_id } = require('../controllers/user');
const { setUserType, isAdmin } = require('../middlewares/auth');

router.patch('/password', patch_password);

router.patch('/email', patch_email);

router.patch('/username', patch_username);

router.get('/', setUserType, get_user);

// router.patch('/', patch_user);

module.exports = router;