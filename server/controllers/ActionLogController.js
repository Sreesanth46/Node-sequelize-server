const db = require('../models')
const logger = require('../logger')
const ActionLog  = db.action_log


const actionLog = async (userId, module, action) => {
    try {
        await ActionLog.create({
            userId: userId,
            module: module,
            action: action
        })
    } catch (err) {
        if(err) return logger.warn("Error creating action log", {module: `actionController`})
    }
    return logger.info("Action log created", {module: `actionController`})
}

module.exports = { actionLog }