require('./utils/misc/extendDatePrototype');

const fs = require('fs');
const path = require('path');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const compression = require('compression');

const config = require('./config.json');
const port = config['connection']['port'];
const connectionString = config['connection']['mongodb']['connection_string'];
const connectionOptions = config['connection']['mongodb']['options'];

mongoose.connect(connectionString, connectionOptions);

const api = express();

api.use(cors());
api.use(compression());
api.use(express.urlencoded({ extended: true }));
api.use(express.json());

api.listen(port, (error) => {
    if (error) {
        console.log(error);
        process.exit(1);
    }

    require('./utils/database');

    try {

        fs.readdirSync(path.join(__dirname, 'routes')).map((file) => {
            require(`./routes/${file}`)(api);
        });
        console.log(`API is now running on port ${port}`);

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
});

module.exports = api;