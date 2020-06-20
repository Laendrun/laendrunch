const Joi = require('@hapi/joi');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db_utils = require('../db_utils');

const signup_schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().trim().min(10).required(),
    email: Joi.string().email({ tlds: { allow: false } }),
});

const login_schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().trim().min(10).required(),
});

const create_schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().alphanum().min(10).required(),
    email: Joi.string().email({ tlds: { allow: false } }),
    role_id: Joi.number().optional(),
});

exports.auth_signup = async (req, res, next) => {
    const db = db_utils.makeDb(db_utils.config);
    const { error, value } = signup_schema.validate(req.body);

    if (!error) {
        let sql = "SELECT * FROM ?? WHERE ?? = ?";
        let inserts = ['users', 'username', value.username];
        sql = mysql.format(sql, inserts);

        try {
            const user = await db.query(sql);
            if (user[0]) {
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
            next(error);
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

exports.auth_login = async (req, res, next) => {
    const db = db_utils.makeDb(db_utils.config);
    // validate user
    const { error, value } = login_schema.validate(req.body);

    if (!error) {
        // check if username in db
        let sql = "SELECT * FROM ?? WHERE ?? = ?";
        let inserts = ['users', 'username', value.username];
        sql = mysql.format(sql, inserts);

        try {
            const user = await db.query(sql);
            if (!user[0]) {
                error422(res, next);
            } else {
                // compare password with hashed password
                bcrypt
                    .compare(value.password, user[0].password)
                    .then((result) => {
                        if (result) {
                            createToken(user[0], res, next);
                        } else {
                            error422(res, next);
                        }
                    })
            }

        } catch (err) {
            const error = new Error(err);
            res.status(500);
            next(err);
        } finally {
            await db.close();
        }



    } else {
        error422(res, next);
    }
}

exports.auth_create = async (req, res, next) => {
    const db = db_utils.makeDb(db_utils.config);
    const { error, value } = create_schema.validate(req.body);

    if (!error) {
        let sql = "SELECT * FROM ?? WHERE ?? = ?";
        let inserts = ['users', 'username', value.username];
        sql = mysql.format(sql, inserts);

        try {
            const user = await db.query(sql);
            if (user[0]) {
                const error = new Error('Username unavailable, please choose another one.');
                res.status(409);
                next(error);
            } else {
                const hashedPassword = await bcrypt.hash(value.password.trim(), 12);
                const role_id = value.role_id ? value.role_id : 1;
                const newUser = {
                    username: value.username,
                    password: hashedPassword,
                    email: value.email,
                    role_id: role_id
                };
                let sql = "INSERT INTO ?? (username, password, email, role_id) VALUES (?, ?, ?, ?)";
                let inserts = ['users', newUser.username, newUser.password, newUser.email, newUser.role_id];
                sql = mysql.format(sql, inserts);
                const insertedUser = await db.query(sql);
                console.log(insertedUser);
                return res.status(201).json({
                    "id": insertedUser.insertId,
                    "username": newUser.username,
                    "email": newUser.email,
                    "role_id": newUser.role_id
                });
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
            error: 'Validation failed',
            message: error.message
        })
    }
}

function createToken(user, res, next) {
    const SECRET = process.env.JWT_SECRET;

    const payload = {
        _id: user._id,
        username: user.username,
        email: user.email,
        role_id: user.role_id
    };

    jwt.sign(payload, SECRET, {
        expiresIn: '1d'
    }, (err, token) => {
        if (err) {
            error422(res, next);
        } else {
            res.json({
                token: token,
                role_id: user.role_id
            });
        }
    });
}

function error422(res, next) {
    res.status(422);
    const error = new Error('Unable to login.');
    next(error);
}
