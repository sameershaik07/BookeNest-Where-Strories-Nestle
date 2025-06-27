const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: String,
    category: String,
    language: String,
    price: Number,
    image: String, // cover image URL
    description: String,
    googleDriveLink: {
        type: String,
        required: true, // Must have a Drive link to read the book
    },
    // --- New fields for Home page functionality ---
    isNewRelease: {
        type: Boolean,
        default: false // Default to false, set to true for new books
    },
    isTrending: {
        type: Boolean,
        default: false // Default to false, set to true for trending books
    },
    reads: {
        type: Number,
        default: 0 // Initialize read count to 0
    }
    // --- End new fields ---
}, {
    timestamps: true // Adds createdAt and updatedAt
});

module.exports = mongoose.model('Book', BookSchema);