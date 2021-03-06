require('./utils/misc/extendDatePrototype');

const fs = require('fs');
const path = require('path');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const compression = require('compression');

const sheets = require('./sheets/index');

const config = require('./config.json');
const port = config['connection']['port'];
const connectionString = config['connection']['mongodb']['connection_string'];
const connectionOptions = config['connection']['mongodb']['options'];

require('./database/models/weekModel');
require('./database/models/productModel');
require('./database/models/userModel');

mongoose.connect(connectionString, connectionOptions);

const api = express();

api.use(cors());
api.use(compression());
api.use(express.urlencoded({ extended: true }));
api.use(express.json());

api.listen(port, async (error) => {
    if (error) {
        console.log(error);
        process.exit(1);
    }

    try {

        fs.readdirSync(path.join(__dirname, 'routes')).map((file) => {
            require(`./routes/${file}`)(api);
        });
        console.log(`API is now running on port ${port}`);

    } catch (error) {
        console.log(error);
        process.exit(1);
    }

    await sheets();
});

module.exports = api;