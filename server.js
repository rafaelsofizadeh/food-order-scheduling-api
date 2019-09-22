require('./utils/misc/extendDatePrototype');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const express = require('express');
const expressWinston = require('express-winston');
const compression = require('compression');

const config = require('./config.json');
const port = config['server']['port'];
const loggerOptions = require('./utils/logger/loggerOptions.js');
const Logger = require('./utils/logger/logger.js');
const logger = new Logger();

const api = express();

api.use(cors());
api.use(compression());
api.use(express.urlencoded({ extended: true }));
api.use(express.json());

api.use(expressWinston.logger(loggerOptions));

api.listen(port, (error) => {
    if (error) {
        logger.error(error);
        process.exit(1);
    }

    require('./utils/database');

    fs.readdir(path.join(__dirname, 'routes')).map((file) => {
        require(`./routes/${file}`)(api);
    });
    logger.info(`API is now running on port ${port}`);
});

api.use(expressWinston.errorLogger(loggerOptions));

module.exports = api;