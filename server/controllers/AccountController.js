const db = require('../models')
const User = db.user_master
const Login = db.login_master
const Company = db.company_master
const { generatePassword } = require('../utils/generatePassword')

exports.addAccount = async (req, res, next) => {

    // TODO: validation and error handling

    if (req.user.role > req.body.role) return res.status(403).json({ message: "You cannot add an Owner" });

    let user = await User.findOne({
        where: {
            [Op.or]: [{ email: req.body.email }, { accountId: req.body.email }]
        }
    });
    if (user != null) return res.status(400).json({ message: "Account already exists with that email or accountId" });

    const generatedPassword = generatePassword()
    const encryptedPassword = await bcrypt.hash(generatedPassword, 10)

    const {
        nickName,
        accountId,
        department,
        jobTitle,
        email,
        disallowCollaboration,
        profileEditing
    } = req.body

    const { companyId } = req.user

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
    const user = await User.findAll({ where: { companyId: req.user.companyId } });
    return res.status(200).json(user)
}

exports.editAccount = async (req, res, next) => {

    if (req.user.role > req.body.role) return res.status(403).json({ message: "Forbidden" });

    // TODO: Validation and error messages

    let emailChanged = false;
    let accountIdChanaged = false;

    let user = await User.findOne({
        where: {
            [Op.or]: [{ email: req.body.email }, { accountId: req.body.email }]
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
            nickName: req.body.nickName,
            accountId: req.body.accountId,
            department: req.body.department,
            jobTitle: req.body.jobTitle,
            email: req.body.email,
            disallowCollaboration: req.body.disallowCollaboration,
            profileEditing: req.body.profileEditing
        }, {
            transaction: t
        });

        await login.update({
            accountId: req.body.accountId,
            email: req.body.email,
            role: req.body.role
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