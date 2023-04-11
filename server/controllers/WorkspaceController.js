const db = require('../models');
const User  = db.user_master;
const Workspace  = db.workspace_master;

exports.add = async (req, res, next) => {
    
    const user = await User.findOne({ where: { email: req.user.email }});
    if(user === null) return res.status(400).send("message: Couldnt find owner of token")

    try {
        await Workspace.create({
            name: req.body.name,
            code: req.body.code,
            // Get companyId by verifying token
            companyId: user.companyId
        })
    } catch (err) {
        return next(err);
    }

    return res.send("message: Workspace added successfully").status(200);
}

exports.list = async (req, res, next) => {

    const workspace = await Workspace.findAll();
    if(workspace == null) return res.status(200).send("message: No workspace found");

    return res.status(200).json(workspace)
} 