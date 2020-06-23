const express = require('express');
const router = express.Router();

const { patch_password, patch_email, patch_username, get_user, delete_user } = require('../controllers/user');
const { setUserType, isAdmin } = require('../middlewares/auth');

router.patch('/password', patch_password);

router.patch('/email', patch_email);

router.patch('/username', patch_username);

router.get('/', setUserType, get_user);

router.delete('/delete', isAdmin, delete_user);

// router.patch('/', patch_user);

module.exports = router;