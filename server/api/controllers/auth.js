const Joi = require('@hapi/joi');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db_utils = require('../db_utils');

const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().trim().min(10).required(),
    email: Joi.string().email({ tlds: { allow: false } }),
});

const login_schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().trim().min(10).required(),
});

exports.auth_signup = async (req, res, next) => {
    const db = db_utils.makeDb(db_utils.config);
    const { error, value } = schema.validate(req.body);

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
    const db = makeDb(db_utils.config);
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

function createToken(user, res, next) {
    const SECRET = '8T6D2EK6E4nRDPgnMyp7cd6rh6mqTnBNxxZ8sb8jZ7rbXkPe93PxK3txFbk4JdKWrRRr53QhMfyRFRRd8CakrEFGV5WLwVeRB3CTdqD7kmnMWsPsL97vCSFJwDstet6pZcQzU8HCJqH475N6F7BMEKWS8nfFBrnMtL3fTwDcapchZUCAa3ThP3eXTy5TFnA5UcjHZQSHB5jPgRwnhFHt74c5TpECE3jDGqWQnwrvAWup7dZ9MCTwQ4z34AC74Tnx';

    const payload = {
        _id: user._id,
        username: user.username,
        email: user.email
    };

    jwt.sign(payload, SECRET, {
        expiresIn: '1d'
    }, (err, token) => {
        if (err) {
            error422(res, next);
        } else {
            res.json({
                token
            });
        }
    });
}

function error422(res, next) {
    res.status(422);
    const error = new Error('Unable to login.');
    next(error);
}
