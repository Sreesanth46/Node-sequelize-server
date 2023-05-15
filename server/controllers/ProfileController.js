const nodeMailer = require('../utils/nodeMailer')
const template = require('../views/template')
const bcrypt = require('bcrypt')
const db = require('../models');
const User = db.user_master;
const Login = db.login_master;
const Company = db.company_master;
const logger = require('../logger')
const { actionLog } = require('../controllers/ActionLogController');
const { profileUpdateVaildation, changePasswordValidation } = require("../middleware/validation");
const { throwErrorCode } = require('../error/error');

// Get current user profile
exports.list = async (req, res, next) => {
    const { userId, companyId } = req.user

    const user = await User.findOne({
        where: { id: userId },
        include: {
            model: Login,
            as: 'auth',
            attributes: ['role', 'passwordChange', 'lastLogin'],
        }
    });
    if (user == null) return res.status(400).send("message: No User found");

    const company = await Company.findOne({ where: { id: companyId } })
    if (company == null) return res.status(400).send("message: No company found");

    actionLog(userId, `profile`, `view`)
    return res.status(200).json({ user, company })
}

// Update current user profile
exports.update = async (req, res, next) => {
    let emailFlag = false
    let currentEmail

    const { error } = await profileUpdateVaildation(req.body);
    if (error) return res.status(400).json(throwErrorCode(error.details[0].message));

    const {
        nickName,
        department,
        jobTitle,
        email,
    } = req.body

    const { userId } = req.user

    const user = await User.findOne({ where: { id: userId } });
    if (user == null) return res.status(400).send("message: No User found");

    // check if user is changing email
    if (user.email !== email) {
        emailFlag = true
        currentEmail = user.email;
    }

    // check if a user with that email already exists
    if (emailFlag) {
        const userCheck = await User.findOne({ where: { email: email } });
        if (userCheck != null) return res.status(400).send("message: User with email already exists")
    }

    const company = await Company.findOne({ where: { email: user.email } });

    const login = await Login.findOne({ where: { id: userId } });
    if (login == null) return res.status(400).send("message: No User found");

    const t = await db.sequelize.transaction();

    try {

        if (req.file == null || undefined) {
            await user.update({
                nickName,
                department,
                jobTitle,
                email,
            }, { transaction: t });
        } else {
            await user.update({
                nickName,
                department,
                jobTitle,
                email,
                profilePic: `http://annotation.innovaturelabs-images.infra/${req.file.filename}`
            }, { transaction: t });
        }

        if (emailFlag) {
            await login.update({
                email
            }, { transaction: t });
        }

        // if user is the owner of the company
        if (company != null) {
            await company.update({
                email
            })
        }

        await t.commit();

    } catch (err) {
        logger.warn(`${err}`, { module: `Profile Update` })
        await t.rollback();
        return res.status(400).json({ message: "Something went wrong please try again" })
    }

    if (emailFlag) {
        // notify user that the password has changed
        const name = `${user.firstName} ${user.lastName}`
        const mailBody = template.updateEmail(name, currentEmail, email);
        const subject = `Email updated`;
        nodeMailer.sendMail(mailBody, currentEmail, subject)
    }
    actionLog(req.user.userId, `profile`, `update`)
    return res.status(201).json(user)
}

exports.changePassword = async (req, res, next) => {
    const { newPassword, currentPassword } = req.body
    const { loginId, userId } = req.user

    if (newPassword === currentPassword) return res.status(400).json({ message: "New password cannot be same as old password" })

    const { error } = await changePasswordValidation(req.body);
    if (error) return res.status(400).json(throwErrorCode(error.details[0].message));

    const login = await Login.findOne({ where: { id: loginId } });
    if (login == null) return res.status(400).send("message: No User found");

    const isEqual = await bcrypt.compare(req.body.currentPassword, login.password)
    if (!isEqual) return res.status(400).json({ message: "Incorrect password" })

    const encryptedPassword = await bcrypt.hash(req.body.newPassword, 10)

    const datetime = new Date()
    const t = await db.sequelize.transaction();

    try {
        await login.update({
            password: encryptedPassword,
            passwordChange: datetime
        }, {
            where: { id: userId },
            transaction: t
        });
        await t.commit();
    } catch (err) {
        logger.warn(`${err}`, { module: `Profile changePassword` })
        await t.rollback();
        return res.status(400).json({ message: "Something went wrong please try again" })
    }
    // notify user that the password has changed
    const user = await User.findOne({ where: { id: userId } });

    let name = `${user.firstName} ${user.lastName}`
    if (name.length < 3) name = user.nickName

    const mailBody = template.updatePassword(name);
    const email = user.email;
    const subject = `Password updated`;
    nodeMailer.sendMail(mailBody, email, subject)

    actionLog(req.user.userId, `profile/password`, ` update`)
    return res.status(201).json({ message: "password updated successfully" })

}

exports.getCompanyProfile = async (req, res, next) => {
    const { userId } = req.user;

    const user = await User.findOne({ where: { id: userId } });
    if (user == null) return res.status(400).send("message: No User found");
    const company = await Company.findOne({ where: { id: user.companyId } });
    if (company == null) return res.status(400).send("message: No Company found");

    actionLog(userId, `profile/getCompanyProfile`, `view`)
    return res.status(200).json({ user, company })
}