const express = require('express');
const router = express.Router();

const { get_role_id } = require('../controllers/roles');
const { isLoggedIn } = require('../middlewares/auth');

router.get('/id', isLoggedIn, get_role_id);

module.exports = router;