const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the User model
        required: true,
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book', // References the Book model
        required: true,
    },
    quantity: { // Added quantity field for future extensibility (e.g., multiple copies of the same book)
        type: Number,
        default: 1,
    },
    addedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('CartItem', CartItemSchema);