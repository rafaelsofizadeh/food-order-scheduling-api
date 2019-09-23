const mongoose = require('mongoose');
const orderSchema = require('./orderSchema');

module.exports = mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    orders: [orderSchema],
    status: {
        type: String,
        enum: ['empty', 'in progress', 'finished'],
        default: 'empty'
    }
});