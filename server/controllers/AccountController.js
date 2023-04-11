const db = require('../models')
const User = db.user_master
const Login = db.login_master
const Company = db.company_master
const template = require('../views/template')
const { generatePassword } = require('../utils/generatePassword')
const { throwErrorCode } = require('../error/error')
const { Op } = require('sequelize');


exports.addAccount = async (req, res, next) => {

    // TODO: validation and error handling

    const {
        nickName,
        accountId,
        department,
        jobTitle,
        email,
        disallowCollaboration,
        profileEditing,
        role
    } = req.body

    const { companyId } = req.user

    if (req.user.role > role) return res.status(403).json({ message: "You cannot add an Owner" });

    let user = await User.findOne({
        where: {
            [Op.or]: [{ email: email }, { accountId: email }]
        }
    });
    if (user != null) return res.status(400).json({ message: "Account already exists with that email or accountId" });

    const generatedPassword = generatePassword()
    const encryptedPassword = await bcrypt.hash(generatedPassword, 10)

    const t = await db.sequelize.transaction();
    try {
        user = await User.create({
            nickName,
            accountId,
            department,
            jobTitle,
            email,
            disallowCollaboration,
            profileEditing,
            companyId
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
        return res.status(400).json({ message: "Something went wrong please try again" });
    }

    // TODO: Mail service
    return res.status(200).json(user);
}

exports.listAll = async (req, res, next) => {
    const user = await User.findAll({
        where: {
            [Op.and]: [
                { companyId: req.user.companyId },
                { status: { [Op.ne]: 99 } }]
        },
        include: {
            model: Login,
            as: 'auth',
            attributes: ['role', 'passwordChange', 'lastLogin'],
        }
    });
    return res.status(200).json(user)
}

exports.editAccount = async (req, res, next) => {

    // TODO: Validation and error messages

    const {
        nickName,
        accountId,
        department,
        jobTitle,
        email,
        disallowCollaboration,
        profileEditing,
        role
    } = req.body

    if (req.user.role > role) return res.status(403).json({ message: "Forbidden" });

    let emailChanged = false, accountIdChanaged = false;

    let user = await User.findOne({
        where: {
            [Op.or]: [{ email: email }, { accountId: email }]
        }
    });
    if (user != null) return res.status(400).json({ message: "Account already exists with that email or accountId" });
    // if(user.email == req.body.email) return res.status(400)

    user = await User.findOne({ where: { accountId: req.param.id } });
    const login = await Login.findOne({ where: { userId: user.id } });

    if (user.email != req.body.email) emailChanged = true;
    if (user.accountId != req.body.accountId) accountIdChanaged = true;

    const t = await db.sequelize.transaction();
    try {
        await user.update({
            nickName,
            accountId,
            department,
            jobTitle,
            email,
            disallowCollaboration,
            profileEditing
        }, {
            transaction: t
        });

        await login.update({
            accountId,
            email,
            role
        }, {
            transaction: t
        });

        await t.commit();

    } catch (err) {
        await t.rollback();
        return res.status(400).json({ message: "Something went wrong please try again" })
    }

    // TODO: Email service on emailChanged and accountIdChanaged
    return res.status(200).json(user);
}

exports.deleteAccount = async (req, res, next) => {

    if (req.user.role > req.body.role) return res.status(403).json({ message: "Forbidden" });

    const user = await User.findOne({ where: { id: req.params.id } });
    if (user == null) return res.status(400).json({ message: "user not found" });

    const company = await Company.findOne({ where: { email: user.email } });
    if (company != null) return res.status(400).json({ message: "You cannot delete this user" });

    const t = await db.sequelize.transaction();

    try {
        await user.update({
            status: 99
        }, {
            transaction: t
        });

        await Login.update({
            status: 99
        }, {
            where: { email: user.email },
            transaction: t
        });

        await t.commit();

    } catch (err) {
        await t.rollback();
        return res.status(400).json({ message: "Something went wrong please try again" })
    }

    return res.status(200).json({ message: "User deleted successfully", user });
}

exports.searchAccount = async (req, res, next) => {

    const { search } = req.body

    const user = await User.findAll({
        where: {
            [Op.and]: [
                { status: { [Op.ne]: 99 } },
                { companyId: req.user.companyId },
                {
                    [Op.or]: [
                        { email: { [Op.like]: `%${search}%` } },
                        { accountId: { [Op.like]: `%${search}%` } },
                        { nickName: { [Op.like]: `%${search}%` } }
                    ]
                }
            ]
        },
        include: {
            model: Login,
            as: 'auth',
            attributes: ['role', 'passwordChange', 'lastLogin'],
        }
    });

    if (user == null) return res.status(404).json(throwErrorCode("2007 | AccountId / Nickname / EmailId not found"))

    return res.status(200).json(user)
}

exports.resetPassword = async (req, res, next) => {

    const login = await Login.findOne({ where: { accountId: req.body.accountId } })
    if (login == null) return res.status(404).json(throwErrorCode("4007 | Account does not exist"))

    const generatedPassword = generatePassword();
    const encryptedPassword = await bcrypt.hash(generatedPassword, 10);
    const datetime = new Date();

    await login.update({
        password: encryptedPassword,
        passwordChange: datetime
    })

    const mailBody = template.resetPassword(login.accountId, generatedPassword)
    const subject = `Password reset`
    nodeMailer.sendMail(mailBody, login.email, subject)
    return res.status(200).json({ message: "Password reset" })

}