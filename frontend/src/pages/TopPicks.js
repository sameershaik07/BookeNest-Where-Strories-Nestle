import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/TopPicks.css';
import '../styles/Category.css'; // IMPORTANT: Link Category.css for modal and button styles
import Header from './Header';
import Footer from './Footer';

const TopPicks = () => {
  const navigate = useNavigate();
  const [languageFilter, setLanguageFilter] = useState("");
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Modal States (copied from CategoryPage.js) ---
  const [modalBook, setModalBook] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isFading, setIsFading] = useState(false); // Used for modal transition, if any
  // --- End Modal States ---

  useEffect(() => {
    async function fetchAllBooks() {
      try {
        setLoading(true);
        // Make an API call to your backend endpoint that serves all books.
        // Assuming your backend serves all books from 'http://localhost:5000/api/books'
        const res = await axios.get(`${process.env.REACT_APP_API_BASE}/api/books`);

        const booksData = res.data.map(book => ({
          ...book,
          // Ensure priceNum exists for modal and cart functionality, converting if necessary
          priceNum: typeof book.price === "number"
            ? book.price
            : Number(String(book.price).replace(/[^0-9.-]+/g, "")) || 0,
          reads: book.reads || Math.floor(Math.random() * 1000) + 100, // Placeholder if 'reads' isn't from DB
          description: book.description || "No description available for this book." // Ensure description exists
        }));
        setAllBooks(booksData);
      } catch (err) {
        console.error("Failed to fetch all books for Top Picks:", err);
        // You can add user-facing error feedback here, e.g., using a state for error messages
      } finally {
        setLoading(false);
      }
    }
    fetchAllBooks();
  }, []); // Empty dependency array means this effect runs only once on component mount

  // Filter books based on the selected language and then sort by 'reads'
  const filteredAndSortedBooks = allBooks
    .filter(book => languageFilter === "" || book.language === languageFilter)
    .sort((a, b) => b.reads - a.reads); // Sort by most read (highest 'reads' first)

  // Generate unique language options dynamically from the fetched books
  const uniqueLanguages = ["", ...new Set(allBooks.map(book => book.language).filter(Boolean))].sort();

  // --- Modal Functions (copied from CategoryPage.js) ---
  function openModal(book) {
    setModalBook(book);
    setModalOpen(true);
    document.body.style.overflow = "hidden"; // Prevent background scrolling when modal is open
  }

  function closeModal() {
    setModalOpen(false);
    // Delay resetting modalBook to null to allow for any closing animations (e.g., CSS transitions)
    setTimeout(() => setModalBook(null), 440);
    document.body.style.overflow = ""; // Restore background scrolling
  }

  // Effect to close modal on Escape key press (copied from CategoryPage.js)
  useEffect(() => {
    if (!isModalOpen) return; // Only attach listener if modal is open
    const handler = e => e.key === "Escape" && closeModal();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler); // Clean up listener on unmount or modal close
  }, [isModalOpen]); // Re-run effect if isModalOpen changes

  // Clean up body overflow when component unmounts (copied from CategoryPage.js)
  useEffect(() => {
    return () => {
      document.body.style.overflow = ""; // Ensure scrolling is re-enabled if component unmounts while modal is open
    };
  }, []);

  // handleAddToCart Function (copied directly from CategoryPage.js)
  async function handleAddToCart(book, event) {
    // Stop event propagation to prevent the parent div's onClick (openModal) from firing
    if (event) {
      event.stopPropagation();
    }
    try {
      const token = localStorage.getItem('token'); // Get the user's authentication token
      if (!token) {
        alert("Please log in to add books to your cart.");
        // Optionally redirect to login page if user is not authenticated
        // navigate("/login");
        return;
      }

      const response = await axios.post(`${process.env.REACT_APP_API_BASE}/api/cart`, {
        bookId: book._id, // Assuming your book objects from the API have an _id field
        title: book.title,
        author: book.author,
        price: book.priceNum, // Use priceNum, which is already a number
        image: book.image,
      }, {
        headers: {
          'Authorization': `Bearer ${token}` // Send the token for authentication
        }
      });
      alert(`"${book.title}" added to your cart successfully!`);
      console.log('Book added to cart:', response.data);
    } catch (error) {
      console.error("Failed to add book to cart:", error.response ? error.response.data : error.message);
      if (error.response && error.response.status === 400 && error.response.data.msg === 'Book already in cart') {
        alert(`"${book.title}" is already in your cart.`);
      } else if (error.response && error.response.status === 401) {
        alert("You are not authorized. Please log in again.");
        // Optionally clear token and redirect to login
        // localStorage.removeItem('token');
        // navigate("/login");
      } else {
        alert(`Failed to add "${book.title}" to cart. Please try again.`);
      }
    }
  }
  // --- End Modal Functions ---

  return (
    <>
      <Header />
      <div className="top-picks-section">
        <h2>Top Picks</h2>

        <div className="filter-container">
          <select value={languageFilter} onChange={(e) => setLanguageFilter(e.target.value)}>
            <option value="">All Languages</option>
            {uniqueLanguages.map(lang => lang && <option key={lang} value={lang}>{lang}</option>)}
          </select>
        </div>

        <div className="carousel-container">
          {loading ? (
            <p style={{ textAlign: 'center', width: '100%', color: 'gray', marginTop: '2rem' }}>Loading Top Picks...</p>
          ) : filteredAndSortedBooks.length > 0 ? (
            filteredAndSortedBooks.map((book) => (
              <div
                className="book-item" // Retaining 'book-item' for TopPicks-specific styling (e.g., the hover effect)
                key={book._id || book.id} // Use unique _id from DB or fallback to existing id
                onClick={() => openModal(book)} // Clicking anywhere on the card opens the modal
              >
                {/* Book Image Box - consistent with CategoryPage.js for styling */}
                <div className="book-image-box">
                  <img src={book.image || "/default-book.png"} alt={`${book.title} cover`} />
                </div>
                {/* Book Card Content - consistent with CategoryPage.js for styling */}
                <div className="book-card-content">
                  <div className="book-title">{book.title}</div>
                  <div className="book-author">{book.author}</div>
                  <div className="book-price">${book.priceNum ? book.priceNum.toFixed(2) : 'N/A'}</div>
                  <div className="card-btn-group">
                    {/* View Details Button - when clicked, stops propagation and opens modal */}
                    <button className="btn secondary btn-view-details" onClick={(e) => { e.stopPropagation(); openModal(book); }}>
                        View Details
                    </button>
                    {/* Add to Cart Button - when clicked, stops propagation and calls cart function */}
                    <button className="btn btn-add-cart" onClick={(e) => handleAddToCart(book, e)}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', width: '100%', color: 'gray', marginTop: '2rem' }}>No Top Picks found for the selected language.</p>
          )}
        </div>
      </div>

      {/* --- Modal Backdrop (copied from CategoryPage.js) --- */}
      <div
        className={`modal-blur-bg${isModalOpen ? " active" : ""}`}
        onClick={closeModal} // Clicking outside closes the modal
        style={{ cursor: isModalOpen ? "pointer" : "default" }}
        aria-hidden={!isModalOpen} // Accessibility attribute
      />

      {/* --- Modal Content (copied from CategoryPage.js) --- */}
      {modalBook && ( // Only render modal content if a book is selected
        <div className={`modal-popup${isModalOpen ? " active" : ""}`} onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={closeModal}>
            &times; {/* HTML entity for a multiplication sign, commonly used as a close icon */}
          </button>
          <div className="modal-center-content">
            <img
              src={modalBook.image || "/default-book.png"}
              alt={modalBook.title}
              className="modal-book-img"
            />
            <div className="modal-book-details">
              <h2 className="modal-title">{modalBook.title}</h2>
              <p className="modal-meta">Author: {modalBook.author}</p>
              <p className="modal-meta">Language: {modalBook.language}</p>
              <p className="modal-price">${modalBook.priceNum ? modalBook.priceNum.toFixed(2) : 'N/A'}</p>
            </div>
          </div>
          <div className="modal-body">
            {modalBook.description}
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default TopPicks;