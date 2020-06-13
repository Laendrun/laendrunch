const express = require('express');
const router = express.Router();

const EmailController = require('../controllers/email');

router.post('/send', EmailController.email_send);

module.exports = router;