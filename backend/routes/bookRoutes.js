const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const Book = require('../models/Book'); // Make sure this path matches your project
const bookController = require('../controllers/bookController');

// @route   POST /api/books/add
// @desc    Add a new book (admin only)
router.post('/add', authenticateToken, bookController.addBook);

// @route   GET /api/books
// @desc    Get all books
router.get('/', bookController.getBooks);

// @route   GET /api/books/category/:category
// @desc    Get books by category (case-insensitive)
router.get('/category/:category', async (req, res) => {
  try {
    const books = await Book.find({
      category: { $regex: `^${req.params.category}$`, $options: 'i' }
    });
    res.json(books);
  } catch (error) {
    console.error("Error fetching books by category:", error);
    res.status(500).json({ error: 'Failed to fetch books by category' });
  }
});

// Optional future route to get a book by its ID
// router.get('/:id', bookController.getBookById);

module.exports = router;