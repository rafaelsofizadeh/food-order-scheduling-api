const mongoose = require('mongoose');
const agenda = require('../../agenda');

const dateUtil = require('../../utils/misc/extendDatePrototype');

const daySchema = require('../schemas/daySchema');
const User = require('./userModel');

const weekSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    start: {
        type: Date,
        required: true,
        validate: {
            validator: (date) => dateUtil.getFormatDay(date) === 0,
            message: 'start date must be monday'
        },
        //unique: true
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
    userSchedules: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserSchedule'
    }
});


//Initiate automatically on week creation
weekSchema.pre('save', function () {
    if (this.isNew) {
        this.initiate();
        //this.updateUser();
        this.scheduleStatusJobs();
    }
});

//Add a 6 day schedule
/*weekSchema.methods.initiate = async function () {
    for (let days = 0; days < 6; days++) {
        this.days.push({ date: dateUtil.addDays(this.start, days) });
    }
};*/

weekSchema.methods.scheduleStatusJobs = function () {
    const openDate = this.open;
    const closeDate = this.close;

    agenda.schedule(openDate, 'set week status', { weekId: this._id, status: 'open' });
    agenda.schedule(closeDate, 'set week status', { weekId: this._id, status: 'close' });
};

/*weekSchema.methods.updateUser = async function () {
    const user = await User.findById(this.user).lean().exec();
    if (user) {
        user.weeks.push(this._id);

        const updatedUser = await user.save();
        console.log(updatedUser);
    } else {
        throw new Error('Error: couldn\'t validate week creation, incorrect user id');
    }
};*/

//mongoose.plugin(uniqueValidator);

module.exports = mongoose.model('Week', weekSchema);