const jwt = require('jsonwebtoken')
const template = require('../views/template')
const nodeMailer = require('../utils/nodeMailer')
const bcrypt = require('bcrypt')
const db = require('../models')
const Company = db.company_master
const User = db.user_master
const Login = db.login_master
const { Op } = require('sequelize');

const { createError } = require('../error/error');
const { registerValidation } = require("../middleware/validation");

const secretKey = process.env.MAIL_TOKEN_SECRET || "SecretKey"
const clientUrl = process.env.CLIENT_URL

exports.signUp = async (req, res, next) => {

    let user = { email: req.body.email, message: `Please signup using the link below` }
    const token = await jwt.sign({ ...user }, secretKey, { expiresIn: '1h' })
    const url = `${clientUrl}/SignUp/verify?token=${token}`
    const mailBody = template.verifyMail(url)
    const email = req.body.email
    const subject = `Annotation Tool Registertion`
    nodeMailer.sendMail(mailBody, email, subject)
    return res.status(200).send(`message: Success. Please check your email to complete the registration.`)
}

exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.headers['token'];
        const user = jwt.verify(token, secretKey);
        req.user = user;
        return res.status(200).json({success: true, status: 200, message: 'Token verified'})
    } catch (err) {
        return next(createError(403, "Token is invalid"))
    }

}

exports.register = async (req, res, next) => {
    try {
        const token = req.headers['token'];
        const user = await jwt.verify(token, secretKey);
        req.user = user;
    } catch (err) {
        return next(createError(403, "Token is invalid"))
    }

    // Validate request body
    const { error, value } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if a company already exist with the given email 
    let company = await Company.findOne({ where: { email: req.user.email } });
    if (company != null) return res.status(400).json({ message: "Company with this mail already exist"})

    // Check if a user already exist with the given email 
    let user = await User.findOne({ where: { [Op.or]: [{ email: req.user.email }, { accountId: req.body.accountId }] } });
    if (user != null) return res.status(400).json({ message: "User with this mail already exist"})

    const encryptedPassword = await bcrypt.hash(req.body.password, 10)

    const t = await db.sequelize.transaction();

    // Creating a company, user, authUser with provided details
    try {

        company = await Company.create({
            name: req.body.name,
            remaining_account: 10,
            code: req.body.code,
            email: req.user.email,
            collabration: 0,
        }, { transaction: t });

        user = await User.create({
            accountId: req.body.accountId,
            email: company.email,
            companyId: company.id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
        }, { transaction: t });

        await Login.create({
            userId: user.id,
            accountId: user.accountId,
            email: user.email,
            password: encryptedPassword
        }, { transaction: t });

        await t.commit();

    } catch (err) {
        await t.rollback();
        return res.status(400).json({ message: "Something went wrong please try again"})
    }

    return res.status(200).json({ company, user })
}

// check if a company already exists with a given email
exports.findCompanyByEmail = async (req, res, next) => {
    const company = await Company.findOne({ where: { email: req.body.email } });
    if (company === null) {
        return res.status(200).json({ CompanyFound: false })
    } else {
        return res.status(200).json({ CompanyFound: true })
    }
}

// check if a user already exists with a given email
exports.findUserByEmail = async (req, res, next) => {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (user === null) {
        return res.status(200).json({ userFound: false })
    } else {
        return res.status(200).json({ userFound: true })
    }
}