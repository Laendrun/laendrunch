const express = require('express');
const router = express.Router();

const { patch_password, patch_email, patch_username, get_user, delete_user, patch_role_id } = require('../controllers/user');
const { setUserType, isAdmin } = require('../middlewares/auth');

router.patch('/password', patch_password);

router.patch('/email', patch_email);

router.patch('/username', patch_username);

router.patch('/role_id', isAdmin, patch_role_id);

router.get('/', setUserType, get_user);

router.delete('/delete', isAdmin, delete_user);

// router.patch('/', patch_user);

module.exports = router;