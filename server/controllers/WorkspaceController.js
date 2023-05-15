const db = require('../models');
const Items = db.item_master;
const Workspace = db.workspace_master;
const Project = db.project_master;
const ProjectMember = db.project_member;
const User = db.user_master;
const { workspaceValidation } = require("../middleware/validation");
const { throwErrorCode } = require('../error/error');
const logger = require('../logger')
const { actionLog } = require('../controllers/ActionLogController')
const { Op } = require('sequelize');
const { errorCode } = require('../error/errorCode');

exports.add = async (req, res, next) => {

    const { error } = await workspaceValidation(req.body);
    if (error) return res.status(400).json(throwErrorCode(error.details[0].message));

    const { name, code } = req.body;
    const { companyId, userId } = req.user;
    let workspace;

    try {
        workspace = await Workspace.create({
            name,
            code,
            version: 0,
            companyId
        })
    } catch (err) {
        logger.error("Couldnt create workspace", { module: `workspace.add` })
        return res.status(500).json(throwErrorCode(errorCode[1916]))
    }

    actionLog(userId, `workspace.add`, `create`)
    return res.status(201).json(workspace);
}

exports.list = async (req, res, next) => {

    const { companyId, userId } = req.user;
    const sequelize = db.sequelize

    const workspace = await Workspace.findAll({
        where: {
            [Op.and]: [
                { companyId },
                { status: { [Op.ne]: 99 } },
            ]
        },
        attributes: {
            include: [
                [sequelize.fn("COUNT", sequelize.col("project.id")), "projectCount"],
                [sequelize.fn("COUNT", sequelize.col("project.items.id")), "itemCount"]
            ]
        },
        include: {
            model: Project,
            as: 'project',
            required: false,
            attributes: [],
            where: {
                status: { [Op.ne]: 99 }
            },
            include: {
                model: Items,
                as: 'items',
                required: false,
                attributes: [],
            }
        },
        group: ['workspace_master.id']
    });
    if (workspace == null) return res.status(200).json(throwErrorCode(errorCode[1924]));

    actionLog(userId, `workspace.list`, `view`)
    return res.status(200).json(workspace)
}

exports.listByWorkspaceId = async (req, res, next) => {

    const { companyId, userId } = req.user;
    const { id } = req.params;

    const workspace = await Workspace.findOne({
        where: {
            [Op.and]: [
                { id },
                { companyId },
                { status: { [Op.ne]: 99 } }
            ]
        }
    });
    if (workspace == null) return res.status(200).json({ message: `Workspace not found` });

    actionLog(userId, `workspace.listByWorkspaceId`, `view`)
    return res.status(200).json(workspace)
}

exports.edit = async (req, res, next) => {

    const { error } = await workspaceValidation(req.body);
    if (error) return res.status(400).json(throwErrorCode(error.details[0].message));

    const { name, code } = req.body;
    const { id } = req.params;
    const { companyId, userId } = req.user;

    const workspace = await Workspace.findOne({
        where: {
            [Op.and]: [
                { id },
                { companyId },
                { status: { [Op.ne]: 99 } }
            ]
        }
    });
    if (workspace == null) return res.status(404).json(throwErrorCode(errorCode[1915]));

    const t = await db.sequelize.transaction();

    try {
        await workspace.update({
            name,
            code
        }, { transaction: t })

        await t.commit();
    } catch (err) {
        logger.warn(`${err}`, { module: `edit workspace` })
        await t.rollback();
        return res.status(500).json(throwErrorCode(errorCode[1916]))
    }

    actionLog(userId, `workspace.edit`, `update`)
    return res.status(201).json(workspace)
}

exports.delete = async (req, res, next) => {

    const { id } = req.params;
    const { companyId, userId } = req.user;

    const workspace = await Workspace.findOne({
        where: {
            [Op.and]: [
                { id },
                { companyId },
                { status: { [Op.ne]: 99 } }
            ]
        }
    });
    if (workspace == null) return res.status(404).json(throwErrorCode(errorCode[1915]));

    const t = await db.sequelize.transaction();

    try {
        await workspace.update({
            status: 99
        }, { transaction: t })

        await t.commit();
    } catch (err) {
        logger.warn(`${err}`, { module: `delete workspace` })
        await t.rollback();
        return res.status(500).json(throwErrorCode(errorCode[1916]))
    }

    actionLog(userId, `workspace.delete`, `delete`)
    return res.status(201).json({ message: `Workspace Deleted` })
}

exports.search = async (req, res, next) => {

    const { companyId, userId } = req.user;
    const { name } = req.body;

    const workspace = await Workspace.findAll({
        where: {
            [Op.and]: [
                { companyId },
                { status: { [Op.ne]: 99 } },
                {
                    [Op.or]: [
                        { name: { [Op.like]: `%${name}%` } }
                    ]
                }
            ]
        }
    });
    if (workspace == null) return res.status(404).json(throwErrorCode(errorCode[1915]));

    actionLog(userId, `workspace.search`, `view`)
    return res.status(200).json(workspace)
}

exports.listWorkspaceWithProject = async (req, res, next) => {

    const { companyId, userId } = req.user;

    const workspace = await Workspace.findAll({
        where: {
            [Op.and]: [
                { companyId },
                { status: { [Op.ne]: 99 } },
            ]
        },
        include: {
            model: Project,
            as: 'project',
            required: false,
            where: {
                status: { [Op.ne]: 99 }
            },
        },
    });
    if (workspace == null) return res.status(200).json(throwErrorCode(errorCode[1924]));

    actionLog(userId, `workspace.listWorkspaceWithProject`, `view`)
    return res.status(200).json(workspace)
}

exports.searchItemsInWorkspace = async (req, res, next) => {

    const { companyId, userId } = req.user;
    const { itemName, projectName, workspaceName } = req.body;

    const item = await Items.findAll({
        where: {
            [Op.and]: [
                { status: { [Op.ne]: 99 } },
                { name: { [Op.like]: `%${itemName}%` } },
                { '$project.workspace.name$': { [Op.like]: `%${workspaceName}%` } },
                { '$project.name$': { [Op.like]: `%${projectName}%` } },
                { '$project.workspace.company_id$': { [Op.eq]: companyId } },
            ]
        },
        include: [{
            model: Project,
            as: 'project',
            required: false,
            where: {
                status: { [Op.ne]: 99 }
            },
            include: {
                model: Workspace,
                as: 'workspace',
                where: {
                    status: { [Op.ne]: 99 }
                }
            }
        },
        {
            model: ProjectMember,
            as: 'projectMember',
            include: {
                model: User,
                as: 'users',
            }
        }
        ],
    });
    if (item == null) return res.status(404).json(throwErrorCode(errorCode[1915]));

    actionLog(userId, `workspace.search`, `view`)
    return res.status(200).json(item)
}