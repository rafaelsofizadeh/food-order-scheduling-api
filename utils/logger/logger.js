const winston = require('winston');
const loggerOptions = require('./loggerOptions');

module.exports = () => winston.createLogger(loggerOptions);