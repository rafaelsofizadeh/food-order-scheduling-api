const Week = require('../database/models/weekModel.js');

module.exports = (agenda) => {
    agenda.define('set week status', async (job) => {
        const data = job.attr.data;
        const updatedWeek = await Week.findByIdAndUpdate(
            data.weekId,
            { $set: { status: data.status } },
            { new: true }
        );

        console.log(`Status of week at ${updatedWeek.start.toDateString()} updated to ${data.status}`);
    });
};