const bcrypt = require('bcrypt')
const db = require('../models');
const User = db.user_master;
const Login = db.login_master;

exports.list = async (req, res, next) => {
    const user = await User.findOne({ where: { id: req.user.userId }});
    if(user == null) return res.status(400).send("message: No User found");
    return res.status(200).json(user)
}

exports.update = async (req, res, next) => {
    const user = await User.findOne({ where: { id: req.user.userId }});
    if(user == null) return res.status(400).send("message: No User found");

    const login = await Login.findOne({ where: { id: req.user.userId }});
    if(login == null) return res.status(400).send("message: No User found");

    const t = await db.sequelize.transaction();

    try {
        await user.update({
            nickName: req.body.nickName,
            department: req.body.department,
            jobTitle: req.body.jobTitle,
            email: req.body.email
        }, {
            where: { id: req.user.userId },
            transaction: t
        });
    
        await login.update({
            email: req.body.email
        }, {
            where: { id: req.user.userId },
            transaction: t 
        });

        await t.commit();

    } catch (err) {
        await t.rollback();
        return res.status(400).json({ message: "Something went wrong please try again"})
    }

    return res.status(200).json(user)
}

exports.changePassword = async (req, res, next) => {
    if(req.body.password == req.body.oldPassword) return res.status(400).json({message: "New password cannot be same as old password"}) 

    const login = await Login.findOne({ where: { id: req.user.userId }});
    if(login == null) return res.status(400).send("message: No User found");

    const t = await db.sequelize.transaction();

    const isEqual = await bcrypt.compare(req.body.oldPassword, login.password)
    if(isEqual) {
        const encryptedPassword = await bcrypt.hash(req.body.password, 10)

        try {
            await login.update({
                password: encryptedPassword
            }, {
                where: { id: req.user.userId },
                transaction: t 
            });
            await t.commit();
        } catch (err) {
            await t.rollback();
            return res.status(400).json({ message: "Something went wrong please try again"})
        }
        return res.status(200).json({message: "password updated successfully"})
    }
    return res.status(200).json({message: "Incorrect password"})
}