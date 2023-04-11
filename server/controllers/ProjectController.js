const db = require('../models');
const Project = db.project_master;
const Workspace = db.workspace_master;
const StepGroup = db.step_group;
const LabelGroup = db.label_group;

exports.add = async (req, res, next) => {

    // Check if there is a workspace with the given id exists
    let workspace = await Workspace.findByPk(req.body.workspaceId);
    if(workspace == null) return res.status(400).send("message: Workspace not found");

    // Check if there is a StepGroup with the given id exists
    // let stepGroup = await StepGroup.findByPk(req.bod.stepGroupId);
    // if(stepGroup != null) return res.status(400).send("message: StepGroup not found");

    // Check if there is a LtepGroup with the given id exists
    // let labelGroup = await LabelGroup.findByPk(req.bod.labelGroupId);
    // if(labelGroup != null) return res.status(400).send("message: LabelGroup not found");

    try {
        const project = await Project.create({
            name: req.body.name,
            outline: req.body.outline,
            file: req.body.file,
            assigneeFlags: req.body.assigneeFlags,
            dueDateFlag: req.body.dueDateFlag,
            priorityFlag: req.body.priorityFlag,
            stepFlag: req.body.stepFlag,
            tagsFlag: req.body.tagsFlag,
            memoFlag: req.body.memoFlag,
            displayNameFlag: req.body.displayNameFlag,
            companyNameFlag: req.body.companyNameFlag,
            departmentNameFlag: req.body.departmentNameFlag,
            companyCodeFlag: req.body.companyCodeFlag,
            workspaceId: req.body.workspaceId,
            stepGroupId: req.body.stepGroupId,
            labelGroupId: req.body.labelGroupId
        })
    } catch (err) {
        return next(err);
    }

    return res.status(200).json(project);
}

exports.list = async (req, res, next) => {

    const project = await Project.findAll();
    if(project == null) return res.status(200).send("message: No project found");

    return res.status(200).json(project)
} 