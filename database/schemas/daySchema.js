const mongoose = require('mongoose');
const orderSchema = require('./orderSchema');

const daySchema = mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    orders: [orderSchema],
    finalized: {
        type: Boolean,
        default: false
    }
});