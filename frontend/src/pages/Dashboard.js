import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios
import '../styles/Dashboard.css';
import Header from './Header';
import Footer from './Footer';

const DEFAULT_PROFILE =
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; // Default boy avatar image

function Dashboard() {
    const [userName, setUserName] = useState('User'); // Default to 'User'
    const [profilePic, setProfilePic] = useState(DEFAULT_PROFILE);
    const [cartItems, setCartItems] = useState([]);
    const [purchasedBooks, setPurchasedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL = `${process.env.REACT_APP_API_BASE}/api`; // Make sure this matches your backend URL

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Get token from localStorage
                const token = localStorage.getItem('token');
                if (!token) {
                    // Handle case where user is not logged in (e.g., redirect to login)
                    console.error("No authentication token found.");
                    setError("Please log in to view your dashboard.");
                    setLoading(false);
                    return;
                }

                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                };

                // Fetch user profile data from /api/auth
                const userResponse = await axios.get(`${API_BASE_URL}/auth`, config);
                setUserName(userResponse.data.name || 'User');
                setProfilePic(userResponse.data.profilePic || DEFAULT_PROFILE);

                // Fetch cart items from /api/cart
                const cartResponse = await axios.get(`${API_BASE_URL}/cart`, config);
                setCartItems(cartResponse.data);

                // Fetch purchased books from /api/users/purchased-books
                const purchasedResponse = await axios.get(`${API_BASE_URL}/users/purchased-books`, config);
                setPurchasedBooks(purchasedResponse.data);

            } catch (err) {
                console.error("Error fetching dashboard data:", err.response ? err.response.data : err.message);
                setError(err.response ? err.response.data.message || 'Failed to fetch data' : 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []); // Empty dependency array means this runs once on mount

    const handleRemoveFromCart = async (cartItemId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("You are not logged in.");
                return;
            }
            const config = {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            };
            await axios.delete(`${API_BASE_URL}/cart/${cartItemId}`, config);
            setCartItems(cartItems.filter(item => item._id !== cartItemId)); // Optimistically update UI
            console.log("Item removed from cart:", cartItemId);
        } catch (err) {
            console.error("Error removing from cart:", err.response ? err.response.data : err.message);
            alert("Failed to remove item from cart.");
        }
    };

    const handleReadBook = (googleDriveLink) => {
        if (googleDriveLink) {
            window.open(googleDriveLink, '_blank');
        } else {
            alert("No PDF link available for this book.");
        }
    };

    if (loading) {
        return (
            <div className="netflix-dashboard-bg">
                <Header />
                <div className="dashboard-container">
                    <p>Loading dashboard data...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="netflix-dashboard-bg">
                <Header />
                <div className="dashboard-container">
                    <p className="error-message">Error: {error}</p>
                    <p>Please ensure you are logged in and the backend server is running.</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="netflix-dashboard-bg">
            <Header />
            <div className="dashboard-container">
                <div className="dashboard-profile">
                    <img src={profilePic} alt="Profile" className="profile-pic" />
                    <div>
                        <h3>
                            Hello, <span className="dashboard-username">{userName}</span>
                        </h3>
                        <button className="netflix-btn-outline">Edit Profile</button>
                    </div>
                </div>

                <h4 className="dashboard-section-title">🛒 Your Cart</h4>
                <div className="horizontal-scroll-container">
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <div className="book-card" key={item._id}>
                                <div className="card text-center">
                                    <img src={item.bookId.image || 'https://via.placeholder.com/150'} className="card-img-top" alt={item.bookId.title} />
                                    <div className="card-body">
                                        <h6 className="card-title">{item.bookId.title}</h6>
                                        <button
                                            className="netflix-btn-danger"
                                            onClick={() => handleRemoveFromCart(item._id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Your cart is empty.</p>
                    )}
                </div>
                
                {/* Removed Last Read and Favorites sections as requested */}

                <h4 className="dashboard-section-title">📚 Purchased Books</h4>
                <div className="horizontal-scroll-container">
                    {purchasedBooks.length > 0 ? (
                        purchasedBooks.map((book) => (
                            <div className="book-card" key={book._id}>
                                <div className="card text-center">
                                    <img src={book.image || 'https://via.placeholder.com/150'} className="card-img-top" alt={book.title} />
                                    <div className="card-body">
                                        <h6 className="card-title">{book.title}</h6>
                                        <button
                                            className="netflix-btn-success"
                                            onClick={() => handleReadBook(book.googleDriveLink)}
                                        >
                                            Read Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>You haven't purchased any books yet.</p>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Dashboard;