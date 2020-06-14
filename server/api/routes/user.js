const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');

router.patch('/password', UserController.patch_password);

router.patch('/email', UserController.patch_email);

router.patch('/username', UserController.patch_username);

router.get('/', UserController.get_user);

module.exports = router;