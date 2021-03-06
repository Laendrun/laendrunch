const mysql = require('mysql');
const { makeDb, config } = require('../db_utils');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');

const password = Joi.object({
    password: Joi.string().trim().min(10).required(),
})

const email = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }),
})

const username = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
})

exports.patch_password = async (req, res, next) => {
    const db = makeDb(config);
    const { error, value } = password.validate(req.body);

    if (!error) {
        // update password in the db
        const hashedPassword = await bcrypt.hash(value.password.trim(), 12);

        let sql = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
        let inserts = ['users', 'password', hashedPassword, '_id', req.user._id];
        sql = mysql.format(sql, inserts);

        try {
            const update = await db.query(sql);
            return res.status(201).json({
                user: update
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

exports.patch_email = async (req, res, next) => {
    const db = makeDb(config);
    const { error, value } = email.validate(req.body);

    if (!error) {
        let sql = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
        let inserts = ['users', 'email', value.email, '_id', req.user._id];
        sql = mysql.format(sql, inserts);

        try {
            const update = await db.query(sql);
            return res.status(201).json({
                user: update
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
            message: 'Validation failed',
            error: error.message,
        })
    }
}

exports.patch_username = async (req, res, next) => {
    const db = makeDb(config);
    const { error, value } = username.validate(req.body);

    if (!error) {
        let sql = "SELECT * FROM ?? WHERE ?? = ?";
        let inserts = ['users', 'username', value.username];
        sql = mysql.format(sql, inserts);

        try {
            const user = await db.query(sql);
            if (user[0]) {
                const error = new Error('Username unavailable, please choose another one');
                res.status(409);
                next(error);
            } else {
                let sql = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
                let inserts = ['users', 'username', value.username, '_id', req.user._id];
                sql = mysql.format(sql, inserts);
                const update = await db.query(sql);
                return res.status(201).json({
                    user: update
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
        return res.status(403).json({
            message: 'Validation failed',
            error: error.message,
        })
    }
}


exports.get_user = async (req, res, next) => {

    if (req.user.type == 'admin') {
        const db = makeDb(config);

        let sql = "SELECT ??, ??, ??, ?? FROM ?? WHERE 1 ORDER BY ?? DESC";
        let inserts = ['_id', 'username', 'email', 'role_id', 'users', 'role_id'];
        sql = mysql.format(sql, inserts);

        try {
            const users = await db.query(sql);
            return res.status(200).json({
                users: users
            })
        } catch (err) {
            const error = new Error(err);
            res.status(500);
            next(error);
        } finally {
            await db.close();
        }
    } else if (req.user.type == 'user') {
        const db = makeDb(config);

        let sql = "SELECT * FROM ?? WHERE ?? = ?";
        let inserts = ['users', '_id', req.user._id];
        sql = mysql.format(sql, inserts);

        try {
            const user = await db.query(sql);
            return res.status(200).json({
                _id: user[0]._id,
                username: user[0].username,
                email: user[0].email,
                role_id: user[0].role_id
            })
        } catch (err) {
            const error = new Error(err);
            res.status(500);
            next(error);
        } finally {
            await db.close();
        }
    }


}