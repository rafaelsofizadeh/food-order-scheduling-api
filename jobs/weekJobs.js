const mongoose = require('mongoose');
const Week = require('../database/models/weekModel');

module.exports = (agenda) => {
    agenda.define('set week status', async (job) => {
        const data = job.attrs.data;
        const updatedWeek = await mongoose.model('Week').findByIdAndUpdate(
            data.weekId,
            { $set: { status: data.status } },
            { new: true }
        );

        console.log(`Status of week at ${updatedWeek.start.toDateString()} updated to ${data.status}`);
    });
};