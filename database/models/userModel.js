const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    weeks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Week'
    }]
});

module.exports = mongoose.model('User', userSchema);