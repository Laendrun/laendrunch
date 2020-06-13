const Joi = require('@hapi/joi');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const db_utils = require('../db_utils');
const util = require('util');

const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().trim().min(10).required(),
    email: Joi.string().email({ tlds: { allow: false } }),
});

exports.auth_signup = async (req, res, next) => {
    const db = makeDb(db_utils.config);
    const { error, value } = schema.validate(req.body);

    if (!error) {
        let sql = "SELECT * FROM ?? WHERE ?? = ?";
        let inserts = ['users', 'username', value.username];
        sql = mysql.format(sql, inserts);

        try {
            const user = await db.query(sql);
            if(user[0]) {
                const error = new Error('Username unavailable, please choose another one.');
                res.status(409);
                next(error);
            } else {
                const hashedPassword = await bcrypt.hash(value.password.trim(), 12);
                const newUser = {
                    username: value.username,
                    password: hashedPassword,
                    email: value.email,
                };
                let sql = "INSERT INTO ?? (username, password, email) VALUES (?, ?, ?)";
                let inserts = ['users', newUser.username, newUser.password, newUser.email];
                sql = mysql.format(sql, inserts);
                const insertedUser = await db.query(sql);
                return res.status(201).json({
                    "id": insertedUser.insertId,
                    "username": newUser.username
                });
            }
        } catch (err) {
            const error = new Error(err);
            res.status(500);
            next(err);
        } finally {
            await db.close();
        }
    } else {
        return res.status(403).json({
            error: 'Validation failed',
            message: error.message
        })
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