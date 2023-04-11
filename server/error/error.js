const createError = (status, message) => {
    const err = new Error()
    err.status = status
    err.message = message
    return err
}

const throwErrorCode = (message) => {
    const err = new Error()
    err.errorCode = message.split(" | ")[0]
    err.message = message.split(" | ")[1]
    return err
}

module.exports = { createError, throwErrorCode }