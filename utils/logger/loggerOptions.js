const winston = require('winston');

module.exports = {
    transports: [new winston.transports.Console],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
};