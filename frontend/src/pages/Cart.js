import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for API calls
import { useNavigate } from 'react-router-dom';
import "../styles/Cart.css";
import Header from "./Header";
import Footer from "./Footer";

const TAX_RATE = 0.08;

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Function to fetch cart items from the backend
    useEffect(() => {
        const fetchCartItems = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token'); // Get the user's token
                if (!token) {
                    setCart([]);
                    setLoading(false);
                    setError("Please log in to view your cart."); // More user-friendly error
                    // navigate('/signin'); // Consider redirecting if cart requires login
                    return;
                }

                const response = await axios.get("http://localhost:5000/api/cart", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setCart(response.data);
            } catch (err) {
                console.error("Failed to fetch cart items:", err.response ? err.response.data : err.message);
                setError("Failed to load cart. Please try again.");
                setCart([]); // Clear cart on error
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, []);

    // Ensure item.bookId and its price are valid before calculating subtotal
    const subtotal = cart.reduce((sum, item) => {
        // Defensive check: ensure item.bookId and item.bookId.price exist and are numbers
        const price = item.bookId && typeof item.bookId.price === 'number' ? item.bookId.price : 0;
        return sum + price;
    }, 0);

    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    const handleRemove = async (cartItemId, bookTitle) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("You need to be logged in to remove items from cart.");
                return;
            }
            await axios.delete(`http://localhost:5000/api/cart/${cartItemId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCart(cart.filter((item) => item._id !== cartItemId));
            alert(`Removed "${bookTitle}" from cart.`);
        } catch (err) {
            console.error("Failed to remove item:", err.response ? err.response.data : err.message);
            alert(`Failed to remove "${bookTitle}" from cart.`);
        }
    };

    const handleCheckout = () => {
        if (cart.length === 0) {
            alert("Your cart is empty. Please add items before checking out.");
            return;
        }
        navigate('/payment');
    };

    const handleContinueShopping = () => {
        navigate("/dashboard");
    };

    if (loading) {
        return (
            <div className="container">
                <Header />
                <div className="cart-container" style={{ textAlign: 'center', padding: '2rem' }}>
                    <p>Loading cart...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <Header />
                <div className="cart-container" style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()} className="continue-shopping">
                        Retry Loading Cart
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="container">
            <Header />

            <div className="cart-container">
                <section className="cart-items">
                    {cart.length === 0 ? (
                        <div className="empty-cart">
                            <p>Your cart is empty</p>
                            <button
                                className="continue-shopping"
                                onClick={handleContinueShopping}
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        cart.map((item) => (
                            // Add a check for item.bookId here to prevent rendering errors if population fails
                            item.bookId ? (
                                <div key={item._id} className="cart-item">
                                    <img
                                        src={item.bookId.image || 'https://via.placeholder.com/150'} // Access via item.bookId
                                        alt={item.bookId.title} // Access via item.bookId
                                        className="item-image"
                                    />
                                    <div className="item-details">
                                        <div className="item-title">{item.bookId.title}</div> {/* Access via item.bookId */}
                                        <div className="item-author">{item.bookId.author}</div> {/* Access via item.bookId */}
                                        <div className="item-price">${item.bookId.price ? item.bookId.price.toFixed(2) : 'N/A'}</div> {/* Access via item.bookId and add defensive check */}
                                    </div>
                                    <button
                                        className="remove-btn"
                                        onClick={() => handleRemove(item._id, item.bookId.title)} // Access via item.bookId
                                        aria-label={`Remove ${item.bookId.title} from cart`} // Access via item.bookId
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                // Render a placeholder or handle the case where bookId is null/undefined
                                <div key={item._id} className="cart-item">
                                    <p>Error: Book data missing for this item.</p>
                                    <button
                                        className="remove-btn"
                                        onClick={() => handleRemove(item._id, 'Unknown Book')}
                                    >
                                        Remove Invalid Item
                                    </button>
                                </div>
                            )
                        ))
                    )}
                </section>

                <section className="cart-summary">
                    <h2 className="summary-title">Order Summary</h2>
                    <div className="summary-item">
                        <span>Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-item">
                        <span>Tax ({TAX_RATE * 100}%):</span>
                        <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="summary-item summary-total">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <button
                        className="checkout-btn"
                        onClick={handleCheckout}
                        disabled={cart.length === 0}
                    >
                        Proceed to Checkout
                    </button>
                </section>
            </div>

            <Footer />
        </div>
    );
};

export default Cart;