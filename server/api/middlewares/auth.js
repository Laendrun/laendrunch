const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const db_utils = require('../db_utils');

async function checkTokenSetUser(req, res, next) {
    const SECRET = process.env.JWT_SECRET;
    const authHeader = req.get('authorization');
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        const type = authHeader.split(' ')[0];
        if (token && type != 'Special') {
            jwt.verify(token, SECRET, (error, user) => {
                if (error) {
                    console.log(error);
                }
                req.user = user;
                next();
            });
        } else if (token && type == 'Special') {
            const db = db_utils.makeDb(db_utils.config);
            let sql = "SELECT * FROM ?? WHERE ?? = ?";
            let inserts = ['sendmail_tokens', 'token', token];
            sql = mysql.format(sql, inserts);

            try {
                const found = await db.query(sql);
                console.log(found);
                if (found[0]) {
                    const special = {
                        type: 'special',
                    };
                    req.user = special;
                    next();
                } else {
                    const error = new Error('🚫 Un-Authorized 🚫');
                    res.status(401);
                    next(error);
                }
            } catch (err) {
                const error = new Error(err);
                res.status(500);
                next(error);
            } finally {
                await db.close();
            }
        } else {
            next();
        }
    } else {
        next();
    }
}

function isLoggedIn(req, res, next) {
    if (req.user && req.user.type != 'special') {
        next();
    } else {
        const error = new Error('🚫 Un-Authorized 🚫');
        res.status(401);
        next(error);
    }
}

function isAdmin(req, res, next) {
    if (req.user && req.user.role_id == 2) {
        next();
    } else {
        const error = new Error('🚫 Un-Authorized 🚫');
        res.status(401);
        next(error);
    }
}

function isSpecial(req, res, next) {
    if (req.user.type == 'special') {
        next();
    } else {
        const error = new Error('🚫 Un-Authorized 🚫');
        res.status(401);
        next(error);
    }
}

function setUserType(req, res, next) {
    switch (req.user.role_id) {
        case 1:
            req.user.type = 'user';
            next();
            break;
        case 2:
            req.user.type = 'admin';
            next();
            break;
        default:
            req.user.type = 'user';
    }
}

module.exports = {
    checkTokenSetUser,
    isLoggedIn,
    isAdmin,
    isSpecial,
    setUserType
};