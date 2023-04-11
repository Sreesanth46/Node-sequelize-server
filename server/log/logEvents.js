const { format } = require('date-fns')

const fs = require('fs')
const fsPromise = require('fs').promises
const path = require('path')

console.log(format(new Date(), 'yyyyMMdd\tHH:mm:ss'));

const logEvents = async (message) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
    const logItem = `${dateTime}\t${message}`
    console.log(logItem);

    try {
        if(!fs.existsSync(path.join(__dirname, 'logs'))) {
            await fsPromise.mkdir(path.join(__dirname, 'logs'));
        }
        await fsPromise.appendFile(path.join(__dirname, 'logs', 'eventLog.txt'), logItem)
    } catch (err) {
        console.log(err)
    }
}

module.exports = logEvents