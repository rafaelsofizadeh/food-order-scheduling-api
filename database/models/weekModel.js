const mongoose = require('mongoose');
const agenda = require('../../agenda');

const weekSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    //TODO: USER SYSTEM
    start: {
        type: Date,
        required: true,
        validate: {
            validator: (date) => date.getFormatDay() === 0,
            message: 'start date must be monday'
        }
    },
    open: {
        type: Date,
        required: true,
        validate: {
            validator: (date) => date < this.close,
            message: 'open date needs to be earlier than close date'
        }
    },
    close: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'closed',
        enum: ['open', 'urgent', 'closed']
    },
    days: [daySchema]
});

//Initiate automatically on week creation
weekSchema.pre('save', function () {
    if (this.isNew) {
        this.initiate();
        this.scheduleStatusJobs();
    }
});

//Add a 6 day schedule
weekSchema.methods.initiate = function () {
    const startDate = this.start;

    for (let days = 0; days < 6; days++) {
        this.days.push({ date: Date.addDays(startDate, days) });
    }
};

weekSchema.methods.scheduleStatusJobs = function () {
    const openDate = this.open;
    const closeDate = this.close;

    agenda.schedule(openDate, 'set week status', { weekId: this._id, status: 'open' });
    agenda.schedule(closeDate, 'set week status', { weekId: this._id, status: 'closed' });
};

module.exports = module.model('Week', weekSchema);