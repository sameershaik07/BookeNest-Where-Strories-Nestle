import React, { useState, useEffect, useMemo } from "react";
import axios from "axios"; // Make sure axios is imported
import Header from "./Header";
import Footer from "./Footer";
import "../styles/Category.css"; // CSS Link

function getPriceRange(books) {
  if (!books.length) return [0, 0];
  let min = books[0].priceNum;
  let max = books[0].priceNum;
  for (const b of books) {
    if (b.priceNum < min) min = b.priceNum;
    if (b.priceNum > max) max = b.priceNum;
  }
  return [Math.floor(min), Math.ceil(max)];
}

export default function CategoryPage({ category }) {
  const [books, setBooks] = useState([]);
  const [author, setAuthor] = useState("all");
  const [language, setLanguage] = useState("all");
  const [price, setPrice] = useState(0);
  const [modalBook, setModalBook] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE}/api/books/category/${category}`);
        const booksWithPriceNum = res.data.map(b => ({
          ...b,
          priceNum: typeof b.price === "number"
            ? b.price
            : Number(String(b.price).replace(/[^0-9.-]+/g, "")) || 0
        }));
        setBooks(booksWithPriceNum);
        const [_, max] = getPriceRange(booksWithPriceNum);
        setPrice(max);
      } catch (err) {
        console.error("Failed to fetch books", err);
      }
    }
    fetchBooks();
  }, [category]);

  const authorOptions = useMemo(
    () => ["all", ...Array.from(new Set(books.map(b => b.author || "Unknown")))],
    [books]
  );

  const languageOptions = useMemo(
    () => ["all", ...Array.from(new Set(books.map(b => b.language || "Unknown")))],
    [books]
  );

  const [minPrice, maxPrice] = useMemo(() => getPriceRange(books), [books]);

  const filteredBooks = useMemo(() => {
    return books.filter(
      b =>
        (author === "all" || b.author === author) &&
        (language === "all" || b.language === language) &&
        b.priceNum <= price
    );
  }, [books, author, language, price]);

  function handleFilterChange(setter) {
    return (e) => {
      setter(e.target.value);    // ✅ Instant Update
      setIsFading(true);        // Optional fade animation
      setTimeout(() => setIsFading(false), 300);
    };
  }

  function openModal(book) {
    setModalBook(book);
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    setModalOpen(false);
    setTimeout(() => setModalBook(null), 440);
    document.body.style.overflow = "";
  }

  useEffect(() => {
    if (!isModalOpen) return;
    const handler = e => e.key === "Escape" && closeModal();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isModalOpen]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // --- START OF UPDATED handleAddToCart FUNCTION ---
  async function handleAddToCart(book) {
    try {
      const token = localStorage.getItem('token'); // Get the user's authentication token
      if (!token) {
        alert("Please log in to add books to your cart.");
        // Optionally redirect to login page
        // window.location.href = "/login";
        return;
      }

      const response = await axios.post(`${process.env.REACT_APP_API_BASE}/api/cart`, { // **Make sure this URL matches your backend!**
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
        // window.location.href = "/login";
      } else {
        alert(`Failed to add "${book.title}" to cart. Please try again.`);
      }
    }
  }
  // --- END OF UPDATED handleAddToCart FUNCTION ---

  return (
    <>
      <Header />
      <div className="category-container">
        <h1 className="stylish-title">
          {`${category.toUpperCase()} BOOKS`}
        </h1>

        {/* Filters */}
        <section className="filter-section">
          <div className="filter-group">
            <label htmlFor="filter-author" className="filter-label">Author</label>
            <select
              id="filter-author"
              className="filter-select"
              value={author}
              onChange={handleFilterChange(setAuthor)}
            >
              {authorOptions.map(opt => (
                <option key={opt} value={opt}>
                  {opt === "all" ? "All Authors" : opt}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="filter-language" className="filter-label">Language</label>
            <select
              id="filter-language"
              className="filter-select"
              value={language}
              onChange={handleFilterChange(setLanguage)}
            >
              {languageOptions.map(opt => (
                <option key={opt} value={opt}>
                  {opt === "all" ? "All Languages" : opt}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="filter-price" className="filter-label">Price up to</label>
            <input
              type="range"
              id="filter-price"
              className="filter-range"
              min={minPrice}
              max={maxPrice}
              step="0.01"
              value={price}
              onChange={(e) => {
                setPrice(Number(e.target.value));
                setIsFading(true);
                setTimeout(() => setIsFading(false), 300);
              }}
            />
            <div className="price-range-values">
              <span>${minPrice.toFixed(2)}</span>
              <span>${price.toFixed(2)}</span>
              <span>${maxPrice.toFixed(2)}</span>
            </div>
          </div>
        </section>

        {/* Book Grid */}
        <main>
          <div className={`book-grid${isFading ? " fade-exit" : ""}`}>
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book, idx) => (
                <div
                  key={book._id || `${book.title}-${idx}`}
                  className="book-card"
                  style={{ animationDelay: `${0.045 * idx + 0.09}s` }}
                >
                  <div className="book-image-box">
                    <img src={book.image || "/default-book.png"} alt={`${book.title} cover`} />
                  </div>
                  <div className="book-card-content">
                    <div className="book-title">{book.title}</div>
                    <div className="book-author">{book.author}</div>
                    <div className="book-price">${book.priceNum.toFixed(2)}</div>
                    <div className="card-btn-group">
                      <button className="btn secondary btn-view-details" onClick={() => openModal(book)}>
                        View Details
                      </button>
                      <button className="btn btn-add-cart" onClick={() => handleAddToCart(book)}>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', width: '100%', color: 'gray', marginTop: '2rem' }}>
                No books found for selected filters.
              </p>
            )}
          </div>
        </main>
      </div>

      {/* Modal Backdrop */}
      <div
        className={`modal-blur-bg${isModalOpen ? " active" : ""}`}
        onClick={closeModal}
        style={{ cursor: isModalOpen ? "pointer" : "default" }}
        aria-hidden={!isModalOpen}
      />

      {/* Modal Content */}
      {modalBook && (
        <div className={`modal-popup${isModalOpen ? " active" : ""}`} onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={closeModal}>
            &times;
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
              <p className="modal-price">${modalBook.priceNum.toFixed(2)}</p>
            </div>
          </div>
          <div className="modal-body">
            {modalBook.description || "No description available."}
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}