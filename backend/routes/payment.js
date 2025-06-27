const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Your User model
const CartItem = require('../models/CartItem'); // Your CartItem model
const authMiddleware = require('../middleware/authMiddleware'); // Your authentication middleware

// --- IMPORTANT: AUTHENTICATION ---
// If you're still using a dummy authMiddleware for testing,
// make sure 'YOUR_TEST_USER_MONGO_ID' is a valid user ID from your MongoDB 'users' collection.
// Otherwise, ensure your actual authMiddleware is properly populating req.user.id
// based on a valid JWT from a logged-in user.
// ---

// @route   POST api/payment/process
// @desc    Simulate payment processing and update user's purchased books
// @access  Private (requires authentication)
router.post('/process', authMiddleware, async (req, res) => {
    const { cardNumber, expMonth, expYear, cvv, nameOnCard, amount } = req.body;
    const userId = req.user.id; // Get user ID from authenticated request

    // --- Backend's Expected Test Credentials ---
    // CORRECTED: This MUST match your frontend's TEST_CARD_NUMBER exactly
    const TEST_CARD_NUMBER_BACKEND = '2567894390325632'; // Now 16 digits
    const TEST_CVV_BACKEND = '108';
    const TEST_NAME_ON_CARD_BACKEND = 'SameerHussain';

    // --- DEBUGGING LOGS (ADD THESE TO YOUR BACKEND) ---
    console.log("\n--- Backend Payment Process Debug ---");
    console.log(`Received Card Number: '${cardNumber}' (Length: ${cardNumber ? cardNumber.length : 'N/A'})`);
    console.log(`Expected Card Number (Backend): '${TEST_CARD_NUMBER_BACKEND}' (Length: ${TEST_CARD_NUMBER_BACKEND.length})`);
    console.log(`Received CVV: '${cvv}' (Length: ${cvv ? cvv.length : 'N/A'})`);
    console.log(`Expected CVV (Backend): '${TEST_CVV_BACKEND}' (Length: ${TEST_CVV_BACKEND.length})`);
    console.log(`Received Name on Card: '${nameOnCard}' (Length: ${nameOnCard ? nameOnCard.length : 'N/A'})`);
    console.log(`Expected Name on Card (Backend): '${TEST_NAME_ON_CARD_BACKEND}' (Length: ${TEST_NAME_ON_CARD_BACKEND.length})`);

    // Trim the received nameOnCard for robust comparison
    const trimmedReceivedNameOnCard = nameOnCard ? String(nameOnCard).trim() : '';

    console.log("--- Backend Comparison Results ---");
    console.log(`Card Number Match: ${cardNumber === TEST_CARD_NUMBER_BACKEND}`);
    console.log(`CVV Match: ${cvv === TEST_CVV_BACKEND}`);
    console.log(`Name on Card Match (trimmed): ${trimmedReceivedNameOnCard === TEST_NAME_ON_CARD_BACKEND}`);
    console.log("-----------------------------------\n");
    // --- END DEBUGGING LOGS ---

    // --- Simulated Payment Logic (with corrected validation) ---
    if (cardNumber !== TEST_CARD_NUMBER_BACKEND || 
        cvv !== TEST_CVV_BACKEND || 
        trimmedReceivedNameOnCard !== TEST_NAME_ON_CARD_BACKEND) {
        
        console.error("Backend: Test card details mismatch detected. Payment failed.");
        return res.status(400).json({ success: false, message: 'Invalid test card details. Payment failed.' });
    }
    // --- End Simulated Payment Logic ---

    try {
        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            console.error(`Backend: User with ID ${userId} not found.`);
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Get all items from the user's cart
        const cartItems = await CartItem.find({ userId: userId });
        if (cartItems.length === 0) {
            console.warn(`Backend: User ${userId} has an empty cart.`);
            return res.status(400).json({ success: false, message: 'Your cart is empty. Nothing to purchase.' });
        }

        // Extract book IDs from cart items
        const newPurchasedBookIds = cartItems.map(item => item.bookId);

        // Add unique book IDs to the user's purchasedBooks array
        const existingPurchasedBookIds = user.purchasedBooks.map(id => id.toString());
        const updatedPurchasedBookIds = Array.from(new Set([...existingPurchasedBookIds, ...newPurchasedBookIds.map(id => id.toString())]));

        user.purchasedBooks = updatedPurchasedBookIds;
        await user.save(); // Save the updated user with purchased books

        // Clear the user's cart after successful purchase
        await CartItem.deleteMany({ userId: userId });

        console.log(`Backend: Payment successful and ${newPurchasedBookIds.length} books added for user ${userId}. Cart cleared.`);
        res.json({ success: true, message: 'Payment successful and books added to your dashboard!' });

    } catch (err) {
        console.error('Error processing payment or updating user:', err.message);
        res.status(500).json({ success: false, message: 'Server error during payment process.' });
    }
});

// @route   POST api/users/add-purchased-books
// @desc    Adds a list of book IDs to a user's purchased books array (used for testing or specific scenarios)
// @access  Private (requires authentication)
// IMPORTANT: As discussed, it's recommended to move this route to a dedicated userRoutes.js
//            or integrate it into authRoutes.js if it handles general user-related actions.
//            Keeping it here means it's available under /api/payment/users/add-purchased-books
//            if you only use app.use('/api/payment', paymentRoutes) in server.js.
//            If you used app.use('/api', paymentRoutes), it would be /api/users/add-purchased-books.
//            Make sure your frontend call matches how you mount this route.
router.post('/users/add-purchased-books', authMiddleware, async (req, res) => {
    const { bookIds } = req.body; // Array of book _id strings
    const userId = req.user.id;

    if (!Array.isArray(bookIds) || bookIds.length === 0) {
        return res.status(400).json({ message: 'No book IDs provided.' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const existingPurchasedBookIds = user.purchasedBooks.map(id => id.toString());
        const newUniqueBookIds = bookIds.filter(bookId => !existingPurchasedBookIds.includes(bookId));

        if (newUniqueBookIds.length > 0) {
            user.purchasedBooks.push(...newUniqueBookIds);
            await user.save();
        }

        res.json({ message: 'Purchased books updated successfully.' });

    } catch (error) {
        console.error('Error adding purchased books:', error);
        res.status(500).json({ message: 'Server error updating purchased books.' });
    }
});

module.exports = router;