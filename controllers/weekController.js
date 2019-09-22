const mongoose = require('mongoose');
const Logger = require('../utils/logger/logger.js');
const logger = new Logger();
const Week = require('../models/weekModel');
module.exports = {
    weekListController: (request, response) => {
        try {
            const weeks = await Week.find({}).lean().populate('days').exec();

            response
                .status(200)
                .json(weeks);
        } catch (error) {
            logger.error(error);
            response
                .status(500)
                .send('Error: couldn\'t get list of all weeks');
        }
    },
};