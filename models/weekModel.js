const mongoose = require('mongoose');

const weekSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    //IMPORTANT: USER SYSTEM
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
    days: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Day'
    }]
});
module.exports = module.model('Week', weekSchema);