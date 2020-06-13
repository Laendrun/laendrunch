const axios = require('axios');

exports.email_send = (req, res, next) => {
    const SENDMAIL_URL = 'http://sendmail.laendrun.ch/api/mail/send.php';
    const body = 
    {
        to: req.body.to,
        from: req.body.from,
        fromName: req.body.fromName,
        message: req.body.message,
        subject: req.body.subject,
    };

    // send email
    axios.post(SENDMAIL_URL, body)
        .then((response) => {
            res.status(201).json({
                message: response.data.message,
            });
        })
        .catch((error) => {
            res.status(500);
            next(error);
        });
}