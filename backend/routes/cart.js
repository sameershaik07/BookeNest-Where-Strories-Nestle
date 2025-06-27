const express = require('express');
const router = express.Router();
const CartItem = require('../models/CartItem');
const Book = require('../models/Book'); // Assuming you have a Book model
const authMiddleware = require('../middleware/authMiddleware');
const mongoose = require('mongoose'); // Import mongoose to use its Types.ObjectId

// @route   POST api/cart
// @desc    Add book to cart
// @access  Private (requires authentication)
router.post('/', authMiddleware, async (req, res) => {
    const { bookId } = req.body; // Only need bookId to add to cart
    const userId = req.user.id;

    // Validate bookId format
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
        console.warn(`Attempted to add book with invalid bookId format: ${bookId}`);
        return res.status(400).json({ msg: 'Invalid Book ID format' });
    }

    try {
        // Check if the book actually exists
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ msg: 'Book not found' });
        }

        // Check if the book already exists in the user's cart
        let cartItem = await CartItem.findOne({ userId, bookId });

        if (cartItem) {
            // If you implement quantity, uncomment the following lines:
            // cartItem.quantity += 1;
            // await cartItem.save();
            // return res.json(cartItem);
            return res.status(400).json({ msg: 'Book already in cart' });
        }

        // Create new cart item
        cartItem = new CartItem({
            userId,
            bookId,
            quantity: 1 // Default quantity
        });

        await cartItem.save();
        // Populate the book details to send back a complete cart item
        await cartItem.populate('bookId'); // Populate the book details for the response
        res.status(201).json(cartItem);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/cart
// @desc    Get user's cart items
// @access  Private (requires authentication)
router.get('/', authMiddleware, async (req, res) => {
    const userId = req.user.id;

    try {
        const cartItems = await CartItem.find({ userId }).populate('bookId').sort({ addedAt: -1 });
        res.json(cartItems);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/cart/:id
// @desc    Remove a specific item from cart by its _id
// @access  Private (requires authentication)
router.delete('/:id', authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const cartItemId = req.params.id;

    // --- IMPORTANT: Robust ID Validation ---
    // Check if the provided ID is a valid MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(cartItemId)) {
        console.warn(`Attempted to delete cart item with invalid ID format: ${cartItemId}`);
        return res.status(400).json({ msg: 'Invalid Cart Item ID format' });
    }

    try {
        // Find and delete the cart item, ensuring it belongs to the authenticated user
        const cartItem = await CartItem.findOneAndDelete({ _id: cartItemId, userId });

        if (!cartItem) {
            return res.status(404).json({ msg: 'Cart item not found or unauthorized' });
        }

        res.json({ msg: 'Cart item removed' });
    } catch (err) {
        console.error(err.message);
        // This specific catch block for ObjectId is now less likely to be hit
        // if the above isValid check handles it first. But it's good to keep
        // for other potential Mongoose casting errors.
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Invalid ID format' }); // Generic message for other ObjectIds
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/cart/clear
// @desc    Clear all items from user's cart (after checkout)
// @access  Private (requires authentication)
router.delete('/clear', authMiddleware, async (req, res) => {
    const userId = req.user.id;

    try {
        await CartItem.deleteMany({ userId });
        res.json({ msg: 'Cart cleared successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;