const mongoose = require('mongoose');
const agenda = require('../../agenda');

const daySchema = require('../schemas/daySchema');

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
            validator: function (date) {
                return date < this.close;
            },
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
        default: 'close',
        enum: ['open', 'close']
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
weekSchema.methods.initiate = async function () {
    for (let days = 0; days < 6; days++) {
        this.days.push({ date: this.start.addDays(days) });
    }

    const weekSaveResult = await this.save();
    console.log(weekSaveResult);
};

weekSchema.methods.scheduleStatusJobs = function () {
    const openDate = this.open;
    const closeDate = this.close;

    agenda.schedule(openDate, 'set week status', { weekId: this._id, status: 'open' });
    agenda.schedule(closeDate, 'set week status', { weekId: this._id, status: 'closed' });
};

module.exports = mongoose.model('Week', weekSchema);