const mongoose = require('mongoose');
const Week = require('../database/models/weekModel.js');

module.exports = (agenda) => {
    agenda.define('set week status', async (job) => {
        const data = job.attr.data;
        const updatedWeek = await Week.findByIdAndUpdate(
            data.weekId,
            { $set: { status: data.status } },
            { new: true }
        );
        //TODO: add success log
    });
};