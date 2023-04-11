const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const db = require('../models')
const Login  = db.login_master
const { Op } = require("sequelize");

const accessTokenSecret = "SecretKey"
const refreshTokenSecret = "SecretKey"

exports.login = async (req, res, next) => {

    var user = await Login.findOne({ where: {
        [Op.or]: [{email: req.body.email}, {accountId: req.body.email}]
    }});
    if(user === null) return res.send("message: User not found").status(404)
    
    const isEqual = await bcrypt.compare(req.body.password, user.password)
    if(isEqual) {
        user = { accountId: user.accountId, Email: user.email, role: user.role}
        const accessToken = await jwt.sign( {user}, accessTokenSecret, {expiresIn: '12h'})
        const refreshToken = await jwt.sign( {user}, refreshTokenSecret, {expiresIn: '7d'})
        return res.status(200).header("access-Token", accessToken).json({accessToken: accessToken, refreshToken: refreshToken})
    } else {
        return res.status(403).send("Forbidden")
    }
}