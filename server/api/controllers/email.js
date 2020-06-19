const axios = require('axios');
const mysql = require('mysql');
const Joi = require('@hapi/joi');
const db_utils = require('../db_utils.js');

const email_schema = Joi.object({
    to: Joi.string().email({ tlds: { allow: false } }).required(),
    from: Joi.string().email({ tlds: { allow: false } }).required(),
    fromName: Joi.string().trim().required(),
    message: Joi.string().required(),
    subject: Joi.required(),
});

const get_email = Joi.object({
    sender: Joi.string().email({ tlds: { allow: false } }).optional(),
    recipient: Joi.string().email({ tlds: { allow: false } }).optional(),
})

exports.email_send = (req, res, next) => {
    const body =
    {
        to: req.body.to,
        from: req.body.from,
        fromName: req.body.fromName,
        message: req.body.message,
        subject: req.body.subject,
    };

    // send email
    axios.post(process.env.SENDMAIL_API_URL, body)
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

exports.email_save = async (req, res, next) => {
    const db = db_utils.makeDb(db_utils.config);
    // console.log(db_utils.config);
    const { error, value } = email_schema.validate(req.body);

    if (!error) {
        let sql = "INSERT INTO mails values (?, ?, ?, ?, ?, ?, ?)";
        let inserts = [null, new Date(), req.body.from, req.body.fromName, req.body.to, req.body.subject, req.body.message];
        sql = mysql.format(sql, inserts);

        try {
            const email = await db.query(sql);
            return res.status(201).json({
                email: email,
            });
        } catch (err) {
            const error = new Error(err);
            res.status(500);
            next(error);

        } finally {
            await db.close();
        }
    } else {
        return res.status(403).json({
            error: 'Validation failed',
            message: error.message,
        })
    }

}

exports.get_email = async (req, res, next) => {
    const db = db_utils.makeDb(db_utils.config);

    const { error, value } = get_email.validate(req.body);

    console.log(value);

    if (!error) {

        let inserts;
        let condition;

        if (value.recipient || value.sender) {
            if (value.recipient && !value.sender) {
                condition = "WHERE ?? = ?";
                inserts = ['mails', 'to_mail', value.recipient];
            }

            if (value.sender && !value.recipient) {
                condition = "WHERE ?? = ?";
                inserts = ['mails', 'from_mail', value.sender]
            }

            if (value.recipient && value.sender) {
                condition = "WHERE ?? = ? AND ?? = ?";
                inserts = ['mails', 'from_mail', value.sender, 'to_mail', value.recipient];
            }


        } else {
            condition = "WHERE 1"
            inserts = ['mails'];
        }

        let sql = `SELECT * FROM ?? ${condition}`;
        // let sql = "SELECT * FROM ?? WHERE 1";
        // let inserts = ['mails'];
        sql = mysql.format(sql, inserts);
        console.log(sql);

        try {
            const mails = await db.query(sql);
            return res.status(200).json({
                emails: mails
            })

        } catch (err) {
            const error = new Error(err);
            res.status(500);
            next(error);
        } finally {
            await db.close();
        }

    } else {
        return res.status(403).json({
            error: 'Validation failed',
            message: error.message,
        })
    }


}
