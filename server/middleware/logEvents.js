const { format } = require('date-fns')

const fs = require('fs')
const fsPromise = require('fs').promises
const path = require('path')

console.log(format(new Date(), 'yyyyMMdd\tHH:mm:ss'));

const logEvents = async (message, logName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
    const logItem = `${dateTime}\t${message}\n`
    console.log(logItem);

    try {
        if(!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromise.mkdir(path.join(__dirname, '..', 'logs'));
        }
        await fsPromise.appendFile(path.join(__dirname, '..', 'logs', logName), logItem)
    } catch (err) {
        console.log(err)
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt')
    console.log(`${req.method}\t${req.path}`);
    next();
}

module.exports = { logger, logEvents}