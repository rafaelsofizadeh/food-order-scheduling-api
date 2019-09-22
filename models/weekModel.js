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
module.exports = module.model('Week', weekSchema);