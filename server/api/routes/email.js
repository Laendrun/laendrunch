const express = require('express');
const router = express.Router();

const { email_send, email_save, get_email, delete_email } = require('../controllers/email');
const { isAdmin } = require('../middlewares/auth');

router.post('/send', email_send);

router.post('/save', isAdmin, email_save);

router.get('/', isAdmin, get_email);

router.delete('/id', isAdmin, delete_email);

module.exports = router;