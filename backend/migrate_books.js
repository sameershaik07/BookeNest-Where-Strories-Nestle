// migrate_books.js
const mongoose = require('mongoose');
const Book = require('./models/Book'); // Adjust path if needed. This path is relative to migrate_books.js
require('dotenv').config(); // Load environment variables from .env file

// Use the MONGODB_URI from your .env file
const MONGODB_URI = process.env.MONGODB_URI;

// Check if MONGODB_URI is loaded
if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI not found in .env file or environment variables.');
    process.exit(1); // Exit the process with an error code
}

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Add serverSelectionTimeoutMS for better error handling on connection issues
    serverSelectionTimeoutMS: 5000 // Keep trying to send operations for 5 seconds
})
.then(async () => {
    console.log('MongoDB connected for migration.');
    try {
        const result = await Book.updateMany(
            {
                // Select documents that do NOT have these fields defined OR where they are explicitly null
                $or: [
                    { isNewRelease: { $exists: false } },
                    { isTrending: { $exists: false } },
                    { reads: { $exists: false } }
                ]
            },
            {
                // Set default values for new fields
                $set: {
                    isNewRelease: false,
                    isTrending: false,
                    reads: 0
                }
            }
        );
        console.log(`Migration complete: ${result.modifiedCount} books updated with new fields.`);
    } catch (error) {
        console.error('Error during migration:', error);
    } finally {
        await mongoose.disconnect(); // Ensure disconnection
        console.log('MongoDB disconnected.');
    }
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    // Log the full error to help debug connection issues
    console.error('Connection error details:', err.message);
    if (err.reason && err.reason.error) {
        console.error('Specific error:', err.reason.error);
    }
});