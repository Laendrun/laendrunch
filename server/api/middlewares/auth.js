const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const db_utils = require('../db_utils');

async function checkTokenSetUser(req, res, next) {
    const SECRET = '8T6D2EK6E4nRDPgnMyp7cd6rh6mqTnBNxxZ8sb8jZ7rbXkPe93PxK3txFbk4JdKWrRRr53QhMfyRFRRd8CakrEFGV5WLwVeRB3CTdqD7kmnMWsPsL97vCSFJwDstet6pZcQzU8HCJqH475N6F7BMEKWS8nfFBrnMtL3fTwDcapchZUCAa3ThP3eXTy5TFnA5UcjHZQSHB5jPgRwnhFHt74c5TpECE3jDGqWQnwrvAWup7dZ9MCTwQ4z34AC74Tnx';
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

module.exports = {
    checkTokenSetUser,
    isLoggedIn,
    isAdmin,
    isSpecial
};