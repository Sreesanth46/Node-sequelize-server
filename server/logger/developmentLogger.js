const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ message, level, timestamp, module }) => {
    return `${timestamp} [${level}] ${message} ${module}`;
  });

const developmentLogger = () => {
    return createLogger({
        level: 'info',
        format: combine(
            timestamp(),
            myFormat
          ),
        transports: [
            new transports.Console(),
            new transports.File({ filename: './logs/error.txt', level: 'error'}),
            new transports.File({ filename: './logs/combined.txt'})
        ]
    })
}

module.exports = developmentLogger;