const mongoose = require('mongoose');

// Define the User Schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true, // Removes leading/trailing whitespace
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, // Normalize to lowercase
        trim: true,
    },
    password: {
        type: String,
        required: true, // ⚠️ Stored as plain text (INSECURE - see warning below)
    },
    user_type: {
        type: String,
        enum: ['user', 'admin'], // Accept only 'user' or 'admin'
        default: 'user',
    },
    profilePic: { // <<< ADDED THIS FIELD for user profile picture
        type: String,
        default: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', // Default boy avatar
    },
    purchasedBooks: [ // This field stores references to books the user has purchased
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book' // This creates a reference to your Book model
        }
    ],
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

// --- SECURITY WARNING ---
// This version stores passwords in plain text.
// DO NOT use this approach in production.
// To enable secure password hashing, use bcrypt as shown below.
// It's highly recommended to uncomment and use this in a real application.

/*
// Secure version (optional):
const bcrypt = require('bcrypt');

UserSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();
    try {
        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Method to compare a candidate password with the hashed password
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};
*/

// Export the User model
module.exports = mongoose.model('User', UserSchema);