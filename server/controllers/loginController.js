const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
// const Users = require('../models/Users')

const secretKey = "SecretKey"

exports.login = async (req, res, next) => {
    const query = `SELECT * FROM users where email = '${req.body.email}';`
}

exports.register = async (req, res, next) => {
    const encryptedPassword = await bcrypt.hash(req.body.password,10)
    let user = new Users(req.body.name, req.body.email, encryptedPassword)

    user = await user.save()

    console.log(user);

    res.status(201).send("User registered successfully")
}