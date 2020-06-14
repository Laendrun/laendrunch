const jwt = require('jsonwebtoken');

function checkTokenSetUser(req, res, next) {
    const SECRET = '8T6D2EK6E4nRDPgnMyp7cd6rh6mqTnBNxxZ8sb8jZ7rbXkPe93PxK3txFbk4JdKWrRRr53QhMfyRFRRd8CakrEFGV5WLwVeRB3CTdqD7kmnMWsPsL97vCSFJwDstet6pZcQzU8HCJqH475N6F7BMEKWS8nfFBrnMtL3fTwDcapchZUCAa3ThP3eXTy5TFnA5UcjHZQSHB5jPgRwnhFHt74c5TpECE3jDGqWQnwrvAWup7dZ9MCTwQ4z34AC74Tnx';
    const authHeader = req.get('authorization');
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (token) {
            jwt.verify(token, SECRET, (error, user) => {
                if (error) {
                    console.log(error);
                }
                req.user = user;
                next();
            });
        } else {
            next();
        }
    } else {
        next();
    }
}

function isLoggedIn(req, res, next) {
    if (req.user) {
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

module.exports = {
    checkTokenSetUser,
    isLoggedIn
};