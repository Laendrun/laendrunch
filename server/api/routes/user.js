const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');

router.patch('/password', UserController.patch_password);

module.exports = router;