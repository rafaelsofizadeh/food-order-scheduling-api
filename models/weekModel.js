const mongoose = require('mongoose');

const weekSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    //IMPORTANT: USER SYSTEM
    start: {
        type: Date,
        required: true,
    },
    open: {
        type: Date,
        required: true,
    },
    close: {
        type: Date,
        required: true
    },
    days: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Day'
    }]
});

//Initiate automatically on week creation
weekSchema.pre('save', function () {
    if (this.isNew) {
        this.initiate();
    }
    //TODO: set cronjobs
});

//Add a 6 day schedule
weekSchema.methods.initiate = function () {
    const startDate = this.start;

    for (let days = 0; days < 6; days++) {
        this.days.push({ date: Date.addDays(startDate, days) });
    }
};

module.exports = module.model('Week', weekSchema);