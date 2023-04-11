const jwt = require('jsonwebtoken');
const { createError } = require('../error/error');

// Verify autherization token
const verifyToken = async (req, res, next) => {
    let token = req.headers['authorization']
    if(!token) return next(createError(401, "You're not authenticated"))

    token = token.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return next(createError(403, "Token is invalid"))
        req.user = user;
        next()
    })
}

// Verify if the user is Admin
const adminToken = async (req, res, next) => {
    let token = req.headers['authorization']
    if(!token) return next(createError(401, "You're not authenticated"))

    token = token.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return next(createError(403, "Token is invalid"))
        if(user.role == 3) return next(createError(403, "Forbidden"))
        req.user = user;
        next()
    })
}

module.exports = { verifyToken, adminToken }