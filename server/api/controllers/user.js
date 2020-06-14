const mysql = require('mysql');
const db_utils = require('../db_utils');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');

const password = Joi.object({
    password: Joi.string().trim().min(10).required(),
})


exports.patch_password = async (req, res, next) => {
    const db = db_utils.makeDb(db_utils.config);
    const { error, value } = password.validate(req.body);

    if (!error) {
        // update password in the db
        const hashedPassword = await bcrypt.hash(value.password.trim(), 12);

        let sql = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
        let inserts = ['users', 'password', hashedPassword, '_id', req.user._id];
        sql = mysql.format(sql, inserts);

        try {
            const updatedUser = await db.query(sql);
            return res.status(201).json({
                user: updatedUser
            });
        } catch (err) {
            const error = new Error(err);
            res.status(500);
            next(error);
        } finally {
            await db.close();
        }

    } else {
        // validation failed
        return res.status(403).json({
            error: 'Validation failed',
            message: error.message,
        })
    }
}