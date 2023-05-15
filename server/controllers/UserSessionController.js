const db = require('../models')
const logger = require('../logger')
const UserSession  = db.user_session


const userSession = async (userId, idToken) => {
    const date = new Date()
    try {
        await UserSession.create({
            userId: userId,
            idToken: idToken,
            loginTime: date
        })
    } catch (err) {
        return logger.warn("Error creating User session", { module: `UserSessionController`})
    }
    return logger.info("User session created", { module: `UserSessionController` })
}

module.exports = { userSession }