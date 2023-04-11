const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { logger, logEvents } = require('./middleware/logEvents')
const app = express();

// custom middleware logger
app.use(logger);

app.use(bodyParser.json())
app.use(cors())

app.use(require('./routes'))

app.use((err, req, res, next) => {
    const status = err.status
    const message = err.message
    logEvents(`${err}`, 'errLog.txt')
    return res.status(status).json({
        success: false,
        status,
        message
    })
})

module.exports = app;