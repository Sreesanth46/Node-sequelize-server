require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const db = require('../models')
const Login  = db.login_master
const User  = db.user_master
const { Op } = require("sequelize");

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "SecretKey"
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "SecretKey"

exports.login = async (req, res, next) => {

    let authUser = await Login.findOne({ where: {
        [Op.or]: [{email: req.body.email}, {accountId: req.body.email}],
        status: { [Op.ne]: 99 }
    }}); 

    if(authUser === null) return res.send("message: User not found").status(404)
    
    const user = await User.findOne({ where: { email: authUser.email } });

    const isEqual = await bcrypt.compare(req.body.password, authUser.password)
    if(isEqual) {
        const { password, ...userWithoutPassword } = authUser.dataValues;
        await authUser.increment('loginCount')
        // TODO: update last login
        authUser = { loginId: authUser.id, email: authUser.email, role: authUser.role, companyId: user.companyId, userId: user.id}
        const accessToken = await jwt.sign( {...authUser}, accessTokenSecret, {expiresIn: '12h'})
        const refreshToken = await jwt.sign( {...authUser}, refreshTokenSecret, {expiresIn: '7d'})
        return res.status(200).header("access-Token", accessToken).json({...userWithoutPassword, accessToken, refreshToken})
    } else {
        return res.status(403).send("Forbidden")
    }
}