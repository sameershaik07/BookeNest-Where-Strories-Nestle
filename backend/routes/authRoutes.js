const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware'); // Your authentication middleware
const User = require('../models/User'); // Import your User model
const Book = require('../models/Book'); // IMPORTANT: Ensure you import your Book model here for population

// Define authentication routes

/**
 * @route POST /api/signup
 * @description Register a new user.
 * (Accessible at /api/signup because authRoutes is mounted at /api in server.js)
 */
router.post('/signup', authController.signup);

/**
 * @route POST /api/login
 * @description Authenticate a user and return a JWT.
 * (Accessible at /api/login because authRoutes is mounted at /api in server.js)
 */
router.post('/login', authController.login);

/**
 * @route GET /api/auth
 * @description Get authenticated user's basic profile data (name, email, profilePic).
 * This is used by Dashboard.js to display user info.
 * This route is now explicitly '/auth' to match frontend's /api/auth call
 * when this router is mounted at '/api' in server.js.
 * @access Private
 */
router.get('/auth', authenticateToken, async (req, res) => { // CHANGED from router.get('/') to router.get('/auth')
    try {
        // Find the user by ID from the token and select relevant fields
        const user = await User.findById(req.user.id).select('name email profilePic');
        if (!user) {
            console.warn(`Backend: User with ID ${req.user.id} not found during /api/auth fetch.`);
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json(user); // Send back the user object
    } catch (err) {
        console.error('Backend Error: Failed to fetch user data for /api/auth:', err.message);
        res.status(500).send('Server Error fetching user data.');
    }
});

/**
 * @route GET /api/dashboard
 * @description Protected route example - requires valid JWT token.
 * (Accessible at /api/dashboard because authRoutes is mounted at /api in server.js)
 * You might replace this with a more specific dashboard data route or use /api/auth directly.
 */
router.get('/dashboard', authenticateToken, (req, res) => {
    res.json({ message: `Welcome, ${req.user.name}! This is your generic dashboard greeting.` });
});

/**
 * @route GET /api/users/purchased-books
 * @description Get all purchased books for the authenticated user.
 * (Accessible at /api/users/purchased-books because authRoutes is mounted at /api in server.js)
 * This route populates the 'purchasedBooks' array with actual Book documents.
 * @access Private
 */
router.get('/users/purchased-books', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('purchasedBooks'); // Populate the 'purchasedBooks' array with actual Book documents

        if (!user) {
            console.warn(`Backend: User with ID ${req.user.id} not found when fetching purchased books.`);
            return res.status(404).json({ message: 'User not found.' });
        }
        // purchasedBooks should now contain an array of full book objects
        res.json(user.purchasedBooks);
    } catch (err) {
        console.error('Backend Error: Failed to fetch purchased books:', err.message);
        res.status(500).json({ message: 'Server error fetching purchased books.' });
    }
});

/**
 * @route GET /api/admin/users
 * @description Admin-only route to fetch all users.
 * (Accessible at /api/admin/users because authRoutes is mounted at /api in server.js)
 * This route is protected by the authenticateToken middleware.
 * Additionally, it checks if the authenticated user has 'admin' user_type.
 */
router.get('/admin/users', authenticateToken, async (req, res) => {
    // Log who is trying to access this route
    console.log(`Attempting to fetch users by: ${req.user.email} (Type: ${req.user.user_type})`);

    // Check if the authenticated user is an admin
    if (req.user.user_type !== 'admin') {
        console.log(`Access denied for ${req.user.email}: Not an admin.`);
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    try {
        // Fetch all users, selecting only _id, name, email, and user_type
        // We explicitly exclude 'password' for security.
        const users = await User.find({}, '_id name email user_type');
        console.log(`Successfully fetched ${users.length} users.`);
        res.status(200).json(users);
    } catch (err) {
        console.error('Backend Error: Failed to fetch users for admin:', err);
        res.status(500).json({ message: 'Failed to fetch users due to server error.', error: err.message });
    }
});

module.exports = router;