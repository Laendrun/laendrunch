const express = require('express');
const router = express.Router();

const EmailController = require('../controllers/email');

router.post('/send', EmailController.email_send);

router.post('/save', EmailController.email_save);

module.exports = router;