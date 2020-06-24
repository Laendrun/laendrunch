const axios = require('axios');
const mysql = require('mysql');
const Joi = require('@hapi/joi');
const { makeDb, config } = require('../db_utils.js');

const email_schema = Joi.object({
    to: Joi.string().email({ tlds: { allow: false } }).required(),
    from: Joi.string().email({ tlds: { allow: false } }).required(),
    fromName: Joi.string().trim().required(),
    message: Joi.string().required(),
    subject: Joi.required(),
});

exports.email_send = (req, res, next) => {
    const { error, value } = email_schema.validate(req.body);

    if (!error) {
        const body =
        {
            to: req.body.to,
            from: req.body.from,
            fromName: req.body.fromName,
            message: req.body.message,
            subject: req.body.subject,
        };

        this.email_save(req, res, next);

        // send email
        axios.post(process.env.SENDMAIL_API_URL, body)
            .then((response) => {
                console.log(saved_mail);
                res.status(201).json({
                    to: body.to,
                    from: body.from,
                    fromName: body.fromName,
                    message: body.message,
                    subject: body.subject
                });
            })
            .catch((error) => {
                res.status(500);
                next(error);
            });
    } else {
        // validation failed
        return res.status(403).json({
            error: 'Validation failed',
            message: error.message,
        })
    }

}

exports.email_save = async (req, res, next) => {
    const db = makeDb(config);
    // console.log(db_utils.config);
    const { error, value } = email_schema.validate(req.body);

    if (!error) {

        // return saveMail(req.body);

        let sql = "INSERT INTO mails values (?, ?, ?, ?, ?, ?, ?)";
        let inserts = [null, new Date(), req.body.from, req.body.fromName, req.body.to, req.body.subject, req.body.message];
        sql = mysql.format(sql, inserts);

        try {
            const email = await db.query(sql);
            return res.status(201).json({
                _id: email.insertId,
                from: req.body.from,
                fromName: req.body.fromName,
                to: req.body.to,
                subject: req.body.subject,
                message: req.body.message
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
    const db = makeDb(config);
    const to = req.query.to;
    const from = req.query.from;

    let inserts;
    let condition;

    if (!from && !to) {
        condition = "1";
        inserts = ['mails'];
    } else if (from && !to) {
        condition = "?? = ?";
        inserts = ['mails', 'from_mail', from];
    } else if (to && !from) {
        condition = "?? = ?";
        inserts = ['mails', 'to_mail', to];
    } else {
        condition = "?? = ? AND ?? = ?";
        inserts = ['mails', 'to_mail', to, 'from_mail', from];
    }


    let sql = `SELECT * FROM ?? WHERE ${condition}`;
    sql = mysql.format(sql, inserts);

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
}

exports.delete_email = async (req, res, next) => {
    const id = req.query.id;

    if (id) {
        const db = makeDb(config);

        let sql = "DELETE FROM ?? WHERE ?? = ?";
        let inserts = ['mails', '_id', id];
        sql = mysql.format(sql, inserts);

        try {
            const deletedMessage = await db.query(sql);

            if (deletedMessage.affectedRows == 0) {
                const error = new Error('Message not found');
                res.status(404);
                next(error);
            } else {
                return res.status(200).json({
                    message: `Message with id ${id} deleted`
                })
            }
        } catch (err) {
            const error = new Error(err);
            res.status(500);
            next(error);
        } finally {
            await db.close();
        }
    } else {
        const error = new Error('Parameter id is required');
        res.status(422);
        next(error);
    }
}