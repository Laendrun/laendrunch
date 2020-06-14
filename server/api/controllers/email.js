const axios = require('axios');
const mysql = require('mysql');
const util = require('util');
const Joi = require('@hapi/joi');
const db_utils = require('../db_utils.js');

const email_schema = Joi.object({
    to: Joi.string().email({ tlds: { allow: false } }).required(),
    from: Joi.string().email({ tlds: { allow: false } }).required(),
    fromName: Joi.string().trim().required(),
    message: Joi.string().required(),
    subject: Joi.required(),
});

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

    console.log(body);
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

exports.email_save = async (req, res, next) => {
    const db = makeDb(db_utils.config);
    // console.log(db_utils.config);
    const { error, value } = email_schema.validate(req.body);

    if (!error) {
        let sql = "INSERT INTO mails values (?, ?, ?, ?, ?, ?, ?)";
        let inserts = [null, new Date(), req.body.from, req.body.fromName, req.body.to, req.body.subject, req.body.message];
        sql = mysql.format(sql, inserts);

        try {
            const email = await db.query(sql);
            console.log(email);
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
    }
    
}

function makeDb(config) {
    const conn = mysql.createConnection(config)

    return {
        query(sql, args) {
            return util.promisify(conn.query)
                .call(conn, sql, args);
        },
        close() {
            return util.promisify(conn.end().call(conn));
        }
    };
}