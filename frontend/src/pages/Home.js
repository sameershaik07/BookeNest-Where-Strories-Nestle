// Home.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Home.css';
import '../styles/Category.css'; // Import Category.css for modal and button styles
import Header from './Header';
import Footer from './Footer';

function Home() {
    const navigate = useNavigate();
    const [searchVisible, setSearchVisible] = useState(false);
    const [allBooks, setAllBooks] = useState([]); // State to hold all fetched books
    const [loading, setLoading] = useState(true); // State to manage loading status

    // --- Modal States (copied from CategoryPage.js/TopPicks.js) ---
    const [modalBook, setModalBook] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    // --- End Modal States ---

    useEffect(() => {
        async function fetchAllBooks() {
            try {
                setLoading(true);
                const res = await axios.get("http://localhost:5000/api/books");

                const booksData = res.data.map(book => ({
                    ...book,
                    // Ensure priceNum exists and is a number for cart functionality
                    priceNum: typeof book.price === "number"
                        ? book.price
                        : Number(String(book.price).replace(/[^0-9.-]+/g, "")) || 0,
                    description: book.description || "No description available for this book.",
                    // Ensure isNewRelease and isTrending are booleans, default to false if not set
                    isNewRelease: book.isNewRelease || false,
                    isTrending: book.isTrending || false,
                    reads: book.reads || 0 // Default reads to 0 for consistent sorting
                }));
                setAllBooks(booksData);
            } catch (err) {
                console.error("Failed to fetch books for Home page:", err);
                // You might want to display an error message to the user here
            } finally {
                setLoading(false);
            }
        }
        fetchAllBooks();
    }, []); // Empty dependency array ensures this runs only once on component mount

    const toggleSearch = () => {
        setSearchVisible(!searchVisible);
    };

    // --- Modal Functions (copied from CategoryPage.js/TopPicks.js) ---
    function openModal(book) {
        setModalBook(book);
        setModalOpen(true);
        document.body.style.overflow = "hidden"; // Prevent background scrolling
    }

    function closeModal() {
        setModalOpen(false);
        setTimeout(() => setModalBook(null), 440); // Delay resetting modalBook for animation
        document.body.style.overflow = ""; // Restore background scrolling
    }

    // Effect to close modal on Escape key press
    useEffect(() => {
        if (!isModalOpen) return;
        const handler = e => e.key === "Escape" && closeModal();
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [isModalOpen]);

    // Clean up body overflow when component unmounts
    useEffect(() => {
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    // handleAddToCart Function (copied directly from CategoryPage.js/TopPicks.js)
    async function handleAddToCart(book, event) {
        if (event) {
            event.stopPropagation(); // Prevent modal from opening
        }
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Please log in to add books to your cart.");
                return;
            }

            const response = await axios.post("http://localhost:5000/api/cart", {
                bookId: book._id,
                title: book.title,
                author: book.author,
                price: book.priceNum,
                image: book.image,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
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
            } else {
                alert(`Failed to add "${book.title}" to cart. Please try again.`);
            }
        }
    }
    // --- End Modal Functions ---

    // Directly filter New Releases
    const newReleases = allBooks.filter(book => book.isNewRelease);

    // Directly filter Trending Now and sort by reads
    const trendingNow = allBooks
        .filter(book => book.isTrending)
        .sort((a, b) => b.reads - a.reads); // Sort by 'reads' for trending

    return (
        <>
            <Header />

            <div className="hero">
                <div className="hero-content">
                    <h2>Your Story Starts Here</h2>
                    <p>Discover gripping tales and timeless classics handpicked for readers like you.</p>
                    <div className="browse-container">
                        <button onClick={toggleSearch} className="browse-button">Browse Now</button>
                        <input
                            type="text"
                            className={`search-input ${searchVisible ? 'show' : 'hidden'}`}
                            placeholder="Search books..."
                        />
                    </div>
                </div>
            </div>

            {/* Removed the category filter section */}

            <div className="carousel-section">
                <h2>New Releases</h2>
                {loading ? (
                    <p className="loading-message">Loading New Releases...</p>
                ) : newReleases.length > 0 ? (
                    <div className="carousel">
                        {newReleases.map(book => (
                            <BookCard
                                key={book._id}
                                book={book} // Pass the entire book object
                                openModal={openModal}
                                handleAddToCart={handleAddToCart}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="no-books-message">No new releases found.</p>
                )}
            </div>

            <div className="carousel-section">
                <h2>Trending Now</h2>
                {loading ? (
                    <p className="loading-message">Loading Trending Books...</p>
                ) : trendingNow.length > 0 ? (
                    <div className="carousel">
                        {trendingNow.map(book => (
                            <BookCard
                                key={book._id}
                                book={book} // Pass the entire book object
                                openModal={openModal}
                                handleAddToCart={handleAddToCart}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="no-books-message">No trending books found.</p>
                )}
            </div>

            <Footer />

            {/* --- Modal Backdrop (copied from CategoryPage.js) --- */}
            <div
                className={`modal-blur-bg${isModalOpen ? " active" : ""}`}
                onClick={closeModal}
                style={{ cursor: isModalOpen ? "pointer" : "default" }}
                aria-hidden={!isModalOpen}
            />

            {/* --- Modal Content (copied from CategoryPage.js) --- */}
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
                            <p className="modal-meta">Category: {modalBook.category}</p> {/* Still display Category in modal */}
                            <p className="modal-meta">Price: ${modalBook.priceNum ? modalBook.priceNum.toFixed(2) : 'N/A'}</p>
                        </div>
                    </div>
                    <div className="modal-body">
                        {modalBook.description}
                    </div>
                    {/* Add to Cart button inside modal, if desired */}
                    <div className="modal-footer-buttons">
                        <button className="btn btn-add-cart" onClick={(e) => handleAddToCart(modalBook, e)}>
                            Add to Cart
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

// Reusable BookCard Component (updated to accept full book object and handlers)
const BookCard = ({ book, openModal, handleAddToCart }) => (
    <div
        className="card book-card" // Using 'book-card' for Category.css styling
        onClick={() => openModal(book)} // Open modal on card click
    >
        <div className="book-image-box">
            <img src={book.image || "/default-book.png"} alt={book.title} />
        </div>
        <div className="book-card-content">
            <div className="book-title">{book.title}</div>
            <div className="book-author">{book.author}</div>
            <div className="book-price">${book.priceNum ? book.priceNum.toFixed(2) : 'N/A'}</div>
            <div className="card-btn-group">
                <button
                    className="btn secondary btn-view-details"
                    onClick={(e) => { e.stopPropagation(); openModal(book); }}
                >
                    View Details
                </button>
                <button
                    className="btn btn-add-cart"
                    onClick={(e) => handleAddToCart(book, e)}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    </div>
);

export default Home;