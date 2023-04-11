const jwt = require('jsonwebtoken')
const template = require('../views/template')
const nodeMailer = require('../utils/nodeMailer')
const bcrypt = require('bcrypt')
const db = require('../models')
const Company  = db.company_master
const User  = db.user_master
const Login  = db.login_master

const { registerValidation } = require("../middleware/validation");


const secretKey = "SecretKey"


exports.signUp = async (req, res, next) => {

    const { error, value } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = { email: req.body.email, message: `Please signup using the link below` }
    jwt.sign( {user}, secretKey, {expiresIn: '1h'}, (err, token) => {
        const url = `http://localhost/register/${token}`
        const mailBody = template.verifyMail(url)
        const email = req.body.email
        const subject = `Annotation Tool Registertion`
        nodeMailer.sendMail(mailBody, email, subject)
        res.status(200).send(`message: Registered mail was send to the email address`)
    })

}

exports.register = async (req, res, next) => {
    await Company.create({
        name: req.body.name,
        remaining_account: 10,
        code: req.body.code,
        email: req.body.email,
        collabration: 0,
    }).catch((err) => {
        if(err) {
            console.log(err.errors[0]);
            res.send(`message: ${err.errors[0].message}`).status(400)
        } else {
            next()
        }
    })

    const company = await Company.findOne({ where: { email: req.body.email }});
    if(company === null) {
        console.log("No company found");
    } else {
        await User.create({
            accountId: req.body.accountId,
            email: company.email,
            companyId: company.id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            nickName: req.body.nickName
        }).catch((err) => {
            if(err) {
                console.log(err);
                res.send(`message: ${err.errors[0].message}`).status(400)
            } else {
                next()
            }
        })
    }

    const encryptedPassword = await bcrypt.hash(req.body.password,10)

    const user = await User.findOne({ where: { email: company.email }});
    if(user === null) {
        console.log("No user found");
    } else {
        await Login.create({
            accountId: user.accountId,
            email: user.email,
            password: encryptedPassword
        }).catch((err) => {
            if(err) {
                console.log(err);
                res.send(`message: ${err.errors[0].message}`).status(400)
            } else {
                next()
            }
        })
    }

    res.send("message: Company Registered successfully").status(200)
}

exports.findCompanyByEmail = async (req, res, next) => {
    const company = await Company.findOne({ where: { email: req.body.email }});
    if(company === null) {
        res.send("message: Company Not Found").status(404)
    } else {
        res.status(200).json(company)
    }
}

exports.findUserByEmail = async (req, res, next) => {
    const user = await User.findOne({ where: { email: req.body.email }});
    if(user === null) {
        res.send("message: User Not Found").status(404)
    } else {
        res.status(200).json(user)
    }
}