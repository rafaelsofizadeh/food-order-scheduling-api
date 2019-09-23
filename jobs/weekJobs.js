const mongoose = require('mongoose');

const Week = require('../database/models/weekModel.js');

const Logger = require('./utils/logger/logger.js');
const logger = new Logger();

module.exports = (agenda) => {
    agenda.define('set week status', async (job) => {
        const data = job.attr.data;
        const updatedWeek = await Week.findByIdAndUpdate(
            data.weekId,
            { $set: { status: data.status } },
            { new: true }
        );

        logger.info(`Status of week at ${updatedWeek.start.toDateString()} updated to ${data.status}`);
    });
};