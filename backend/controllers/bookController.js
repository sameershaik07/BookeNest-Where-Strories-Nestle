const Book = require('../models/Book');

// @desc    Add a new book (admin only)
// @route   POST /api/books/add
exports.addBook = async (req, res) => {
  try {
    // Ensure only admins can add books
    if (req.user?.user_type !== 'admin') {
      return res.status(403).json({ error: 'Only admins can add books.' });
    }

    let {
      title,
      author,
      category,
      language,
      price,
      image,
      description,
      googleDriveLink
    } = req.body;

    // Basic validation
    if (!title || !author || !category || !price || !googleDriveLink) {
      return res.status(400).json({
        error: 'Title, author, category, price, and Google Drive link are required.'
      });
    }

    // Normalize fields
    title = title.trim();
    author = author.trim();
    category = category.trim().toLowerCase(); // normalize to lowercase
    language = language?.trim();

    const newBook = new Book({
      title,
      author,
      category,
      language,
      price,
      image,
      description,
      googleDriveLink
    });

    await newBook.save();
    res.status(201).json({ message: 'Book added successfully', book: newBook });
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// @desc    Get all books
// @route   GET /api/books
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// @desc    Get books by category
// @route   GET /api/books/category/:category
exports.getBooksByCategory = async (req, res) => {
  try {
    const categoryParam = req.params.category.toLowerCase(); // ensure lowercase
    const books = await Book.find({
      category: { $regex: new RegExp('^' + categoryParam + '$', 'i') } // case-insensitive match
    }).sort({ createdAt: -1 });

    console.log(`Fetched ${books.length} books for category "${categoryParam}"`);
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books by category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
