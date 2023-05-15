const db = require('../models');
const ProjectMember = db.project_member;
const User = db.user_master;
const Project = db.project_master;
const Workspace = db.workspace_master
const { projectMemberValidation } = require("../middleware/validation");
const { throwErrorCode } = require('../error/error');
const logger = require('../logger')
const { actionLog } = require('../controllers/ActionLogController')
const { Op } = require('sequelize');
const { errorCode } = require('../error/errorCode');

exports.add = async (req, res, next) => {

    const { projectMembers } = req.body;
    const { userId, companyId } = req.user;

    const { error } = await projectMemberValidation(req.body);
    if (error) return res.status(400).json(throwErrorCode(error.details[0].message));

    const projects = await Project.findAll({
        where: {
            [Op.and]: [
                { status: { [Op.ne]: 99 } },
                { '$workspace.company_id$': { [Op.eq]: companyId } }
            ]
        },
        include: {
            model: Workspace,
            as: 'workspace',
            attributes: []
        }
    })
    const users = await User.findAll({
        where: {
            [Op.and]: [
                { companyId },
                { status: { [Op.ne]: 99 } }
            ]
        }
    })

    // Check if any user or project does not belong to the user's company
    let unknownUser = [], unknownProject = [];
    const userIds = users.map(user => user.id)
    const projectIds = projects.map(project => project.id)

    try {
        await projectMembers.forEach(element => {
            if (!userIds.includes(element.userId)) unknownUser.push(element.userId)
            if (!projectIds.includes(element.projectId)) unknownProject.push(element.projectId)
        });
    } catch (error) {
        logger.error("projectMembers undefined", { module: `projectMember.add` })
        return res.status(500).json(throwErrorCode(errorCode[1918]));
    }

    if (unknownUser.length != 0) return res.status(404).json({ message: `Users ${unknownUser} does not belong to your company` })
    if (unknownProject.length != 0) return res.status(404).json({ message: `Projects ${unknownProject} does not belong to your company` })

    // TODO: COMPOSITE PK

    let projectMember;
    try {
        projectMember = await ProjectMember.bulkCreate(
            projectMembers,
        )
    } catch (err) {
        logger.error("Couldn't add member", { module: `projectMember.add` })
        return res.status(500).json(throwErrorCode(errorCode[1917]));
    }

    actionLog(userId, `projectMember.add`, `create`)
    return res.status(201).json({ projectMember });
}

exports.list = async (req, res, next) => {
    const { userId } = req.user;

    const projectMember = await ProjectMember.findAll({
        where: {
            [Op.and]: [
                { userId },
                { status: { [Op.ne]: 99 } }
            ]
        },
        include: [{
            model: Project,
            as: 'project',
        }]
    });
    if (projectMember == null) return res.status(200).json({ message: `No project assigned` });

    actionLog(userId, `projectMember.list`, `view`)
    return res.status(200).json(projectMember)
}

exports.edit = async (req, res, next) => {

    const { projectMembers } = req.body;
    const { userId, companyId } = req.user;

    const projects = await Project.findAll({
        where: {
            [Op.and]: [
                { status: { [Op.ne]: 99 } },
                { '$workspace.company_id$': { [Op.eq]: companyId } }
            ]
        },
        include: {
            model: Workspace,
            as: 'workspace',
            attributes: []
        }
    })
    const users = await User.findAll({
        where: {
            [Op.and]: [
                { companyId },
                { status: { [Op.ne]: 99 } }
            ]
        }
    })

    // Check if any user or project does not belong to the user's company
    let unknownUser = [], unknownProject = [];
    const userIds = users.map(user => user.id)
    const projectIds = projects.map(project => project.id)
    try {
        await projectMembers.forEach(element => {
            // TODO: VALIDATION
            if (!userIds.includes(element.userId)) unknownUser.push(element.userId)
            if (!projectIds.includes(element.projectId)) unknownProject.push(element.projectId)
        });
    } catch (error) {
        logger.error("projectMembers undefined", { module: `projectMember.edit` })
        return res.status(500).json(throwErrorCode(errorCode[1918]));
    }

    if (unknownUser.length != 0) return res.status(404).json({ message: `Users ${unknownUser} does not belong to your company` })
    if (unknownProject.length != 0) return res.status(404).json({ message: `Projects ${unknownProject} does not belong to your company` })

    let projectMember;
    try {
        projectMember = await ProjectMember.bulkCreate(
            projectMembers,
            { updateOnDuplicate: ["addEditItem", "deleteItem", "postComment", "deleteComment", "notification"] }
        )
    } catch (err) {
        logger.error("Couldn't edit member", { module: `projectMember.edit` })
        return res.status(500).json(throwErrorCode(errorCode[1917]));
    }

    actionLog(userId, `projectMember.edit`, `update`)
    return res.status(201).json({ projectMember });
}

exports.listByProjectId = async (req, res, next) => {
    const { companyId, userId } = req.user;
    const { projectId } = req.params;

    const projectMember = await ProjectMember.findAll({
        where: {
            [Op.and]: [
                { projectId },
                { '$project.workspace.company_id$': { [Op.eq]: companyId } },
                { status: { [Op.ne]: 99 } }
            ]
        },
        include: [{
            model: Project,
            as: 'project',
            attributes: ['name'],
            include: {
                model: Workspace,
                as: 'workspace',
                attributes: []
            }
        },
        {
            model: User,
            as: 'users',
        }]
    });
    if (projectMember == null) return res.status(404).json({ message: `No project assigned` });

    actionLog(userId, `workspace.listByProjectId`, `view`)
    return res.status(200).json(projectMember)
}

exports.listByUserId = async (req, res, next) => {
    const { companyId, userId } = req.user;
    const { id } = req.params;
    const { search } = req.body;

    const projectMember = await ProjectMember.findAll({
        where: {
            [Op.and]: [
                { userId: id },
                { '$project.workspace.company_id$': { [Op.eq]: companyId } },
                { status: { [Op.ne]: 99 } },
                {
                    [Op.or]: [
                        { '$project.name$': { [Op.like]: `%${search}%` } },
                        { '$project.workspace.name$': { [Op.like]: `%${search}%` } }
                    ]
                }
            ]
        },
        include: [{
            model: Project,
            as: 'project',
            where: {
                status: { [Op.ne]: 99 },
            },
            include: {
                model: Workspace,
                as: 'workspace',
                attributes: ['name']
            }
        },
        {
            model: User,
            as: 'users',
        }]
    });
    if (projectMember == null) return res.status(200).json({ message: `No project assigned` });

    actionLog(userId, `workspace.listByUserId`, `view`)
    return res.status(200).json(projectMember)
}

exports.delete = async (req, res, next) => {
    const { companyId, userId } = req.user;
    const { id } = req.params;

    let projectMember
    try {
        projectMember = await ProjectMember.findOne({
            where: {
                [Op.and]: [
                    { id },
                    { '$project.workspace.company_id$': { [Op.eq]: companyId } },
                    { status: { [Op.ne]: 99 } }
                ]
            },
            include: {
                model: Project,
                as: 'project',
                attributes: [],
                include: {
                    model: Workspace,
                    as: 'workspace',
                    attributes: []
                }
            }
        });

        await projectMember.update({
            status: 99
        })
    } catch (err) {
        logger.error(err, { module: `projectMember.delete` })
        return res.status(500).json(throwErrorCode(errorCode[1917]));
    }

    actionLog(userId, `projectMember.delete`, `delete`)
    return res.status(200).json({ message: `Successfully deleted`, projectMember })
}

// Filter user by department name and Account id or Nickname who are assigned to a project
exports.filterAssignedUser = async (req, res, next) => {
    const { companyId, userId } = req.user;
    const { projectId } = req.params;
    const { departmentName, accountId } = req.body;
    let projectMember

    try {
        projectMember = await ProjectMember.findAll({
            where: {
                [Op.and]: [
                    { projectId },
                    { '$project.workspace.company_id$': { [Op.eq]: companyId } },
                    { status: { [Op.ne]: 99 } },
                    { '$users.department$': { [Op.like]: `%${departmentName}%` } },
                    {
                        [Op.or]: [
                            { '$users.account_id$': { [Op.like]: `%${accountId}%` } },
                            { '$users.nick_name$': { [Op.like]: `%${accountId}%` } }
                        ]
                    }
                ]
            },
            include: [{
                model: Project,
                as: 'project',
                attributes: [
                    'id',
                    'name'
                ],
                include: {
                    model: Workspace,
                    as: 'workspace',
                    attributes: []
                }
            },
            {
                model: User,
                as: 'users',
            }]
        });
    } catch (err) {
        logger.error(err, { module: `projectMember.filterAssignedUser` })
        return res.status(500).json(throwErrorCode(errorCode[1920]));
    }
    if (projectMember == null) return res.status(400).json({ message: `No project assigned` });

    actionLog(userId, `projectMember.filterAssignedUser`, `view`)
    return res.status(200).json(projectMember)
}

exports.filterUnassignedUser = async (req, res, next) => {

    // TODO: Validation - departmentName, accountId is required

    const { companyId, userId } = req.user;
    const { projectId } = req.params;
    const { departmentName, accountId } = req.body;
    let users

    try {
        users = await User.findAll({
            where: {
                [Op.and]: [
                    { companyId },
                    { status: { [Op.ne]: 99 } },
                    { department: { [Op.like]: `%${departmentName}%` } },
                    {
                        [Op.or]: [
                            { accountId: { [Op.like]: `%${accountId}%` } },
                            { nickName: { [Op.like]: `%${accountId}%` } }
                        ]
                    },
                    { '$project_members.user_id$': { [Op.eq]: null } },
                ]
            },
            include: {
                model: ProjectMember,
                where: {
                    projectId,
                    status: { [Op.ne]: 99 }
                },
                required: false,
                attributes: []
            },
        })

    } catch (err) {
        logger.error(err, { module: `projectMember.filterAssignedUser` })
        return res.status(500).json(throwErrorCode(errorCode[1921]));
    }

    actionLog(userId, `projectMember.filterAssignedUser`, `view`)
    return res.status(200).json(users)
}

exports.listDepartments = async (req, res, next) => {
    const { companyId } = req.user;
    let departments

    try {
        const sequelize = db.sequelize
        departments = await User.findAll({
            attributes: [
                [sequelize.fn('DISTINCT', sequelize.col('department')), 'department'],
            ],
            where: {
                [Op.and]: [
                    { companyId },
                    { status: { [Op.ne]: 99 } },
                ]
            }
        })
    } catch (err) {
        logger.error(err, { module: `projectMember.listDepartments` })
        return res.status(500).json(throwErrorCode(errorCode[1919]));
    }

    return res.status(200).json(departments)
}

exports.listWorkspace = async (req, res, next) => {
    const { companyId } = req.user;
    let workspace

    try {
        const sequelize = db.sequelize
        workspace = await Workspace.findAll({
            attributes: [
                [sequelize.fn('DISTINCT', sequelize.col('name')), 'name'],
            ],
            where: {
                [Op.and]: [
                    { companyId },
                    { status: { [Op.ne]: 99 } },
                ]
            }
        })
    } catch (err) {
        logger.error(err, { module: `projectMember.listWorkspace` })
        return res.status(500).json(throwErrorCode(errorCode[1925]));
    }

    return res.status(200).json(workspace)
}

exports.filterUnassiginedProjectByUserId = async (req, res, next) => {

    const { companyId, userId } = req.user;
    const { id } = req.params;
    const { projectName, workspaceName } = req.body;

    let project

    try {
        project = await Project.findAll({
            where: {
                [Op.and]: [
                    { status: { [Op.ne]: 99 } },
                    { '$workspace.company_id$': { [Op.eq]: companyId } },
                    { '$projectMember.user_id$': { [Op.ne]: id } },
                    { '$workspace.name$': { [Op.like]: `%${workspaceName}%` } },
                    { name: { [Op.like]: `%${projectName}%` } },
                ]
            },
            include: [
                {
                    model: ProjectMember,
                    as: 'projectMember',
                    required: false,
                    attributes: []
                },
                {
                    model: Workspace,
                    as: 'workspace',
                    required: false,
                    attributes: [
                        'id',
                        'name'
                    ]
                }
            ]
        })
    } catch (err) {
        logger.error(err, { module: `projectMember.listUnassiginedProjectByUserId` })
        return res.status(500).json(throwErrorCode(errorCode[1926]));
    }

    actionLog(userId, `projectMember.listUnassiginedProjectByUserId`, `view`)
    return res.status(200).json(project)
}

exports.listMemberRoles = async (req, res, next) => {
    const { companyId, userId } = req.user;
    const { projectId } = req.body;
    let projectMember

    try {
        projectMember = await ProjectMember.findAll({
            where: {
                [Op.and]: [
                    { projectId },
                    { userId },
                    { '$project.workspace.company_id$': { [Op.eq]: companyId } },
                    { status: { [Op.ne]: 99 } },
                ]
            },
            include: [{
                model: Project,
                as: 'project',
                attributes: [],
                include: {
                    model: Workspace,
                    as: 'workspace',
                    attributes: []
                }
            },
            {
                model: User,
                as: 'users',
            }]
        });
    } catch (err) {
        logger.error(err, { module: `projectMember.listMemberRoles` })
        return res.status(500).json({ message: "Couldn't list Member Roles" });
    }

    return res.status(200).json(projectMember)
}