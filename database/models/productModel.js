const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['breakfast', 'brunch', 'lunch', 'dinner', 'vegan', 'vegetarian', 'drink']
    },
    quantity: {
        type: String,
        validate: {
            validator: (value) => {
                return /^\d+?\s[a-zа-я]+?\.?$/.test(value);
            },
            message: 'Enter correct quantity format: {empty string} OR {number}{ }{any word, latin or cyrillic}{optional dot}'
        }
    },
    description: String,
    nutrition: {
        fat: Number,
        carbs: Number,
        protein: Number
    }
});

module.exports = mongoose.model('Product', productSchema);