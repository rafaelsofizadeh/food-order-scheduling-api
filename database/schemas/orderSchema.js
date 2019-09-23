const mongoose = require('mongoose');

module.exports = mongoose.Schema({
    product: {
        type: mongoose.Schema.Tyoes.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    }
});