const mongoose = require('mongoose');
const Logger = require('../utils/logger/logger.js');
const logger = new Logger();

const daySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    date: {
        type: Date,
        required: true,
    },
    meals: [{
        type: mongoose.Schema.Tyoes.ObjectId,
        ref: 'Meal'
    }],
    status: {
        type: String,
        enum: ['empty', 'in progress', 'finished'],
        default: 'empty'
    }
});
module.exports = mongoose.model('Day', daySchema);