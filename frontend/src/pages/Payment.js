import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirection after payment
import axios from 'axios'; // For backend API calls
import Header from './Header'; // Assuming you have a Header component
import Footer from './Footer'; // Assuming you have a Footer component
import '../styles/Payment.css'; // Link to the new CSS file

function Payment() {
  const navigate = useNavigate();

  // State for form fields
  const [cardNumber, setCardNumber] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [expYear, setExpYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [paymentError, setPaymentError] = useState('');

  // Sample card details for testing
  const TEST_CARD_NUMBER = '2567894390325632'; // This is now a 16-digit number
  const TEST_CVV = '108';
  const TEST_NAME_ON_CARD = 'Sameer Hussain';

  // Populate sample data for testing on component mount
  useEffect(() => {
    // Only set if fields are empty to allow manual input for other cases
    if (!cardNumber) setCardNumber(formatCardNumber(TEST_CARD_NUMBER));
    if (!cvv) setCvv(TEST_CVV);
    if (!nameOnCard) setNameOnCard(TEST_NAME_ON_CARD);

    // Set expiry year to a future year (e.g., 2026) and month (e.g., 10)
    // You might want to dynamically set this to a valid future date
    const today = new Date();
    const currentYear = today.getFullYear();
    // Setting expiry year to currentYear + 2 (2025 + 2 = 2027)
    // Setting expiry month to '10' (October)
    if (!expMonth) setExpMonth('10');
    if (!expYear) setExpYear(String(currentYear + 2));
  }, []); // Run once on mount

  // Helper to format card number
  const formatCardNumber = (value) => {
    // Remove all non-digits, then format into blocks of 4
    const cleaned = value.replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < cleaned.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += cleaned[i];
    }
    return formatted.slice(0, 19); // Max length 19 (16 digits + 3 spaces)
  };

  // Handle card number input change
  const handleCardNumberChange = (e) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  // Generate year options for dropdown
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 15; i++) { // Generate options for current year + next 14 years
      years.push(currentYear + i);
    }
    return years;
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentError(''); // Clear previous errors

    // Client-side validation
    const rawCard = cardNumber.replace(/\s/g, ''); // Get card number without spaces
    
    // --- DEBUGGING LOGS START HERE ---
    console.log("--- Payment Form Submission Debug ---");
    console.log(`Input Card Number (raw): '${rawCard}' (Length: ${rawCard.length})`);
    console.log(`Expected Card Number (TEST_CARD_NUMBER): '${TEST_CARD_NUMBER}' (Length: ${TEST_CARD_NUMBER.length})`);
    console.log(`Input CVV: '${cvv}' (Length: ${cvv.length})`);
    console.log(`Expected CVV (TEST_CVV): '${TEST_CVV}' (Length: ${TEST_CVV.length})`);
    console.log(`Input Name on Card (original): '${nameOnCard}' (Length: ${nameOnCard.length})`);
    console.log(`Input Name on Card (trimmed): '${nameOnCard.trim()}' (Length: ${nameOnCard.trim().length})`); // Added trim for debug
    console.log(`Expected Name on Card (TEST_NAME_ON_CARD): '${TEST_NAME_ON_CARD}' (Length: ${TEST_NAME_ON_CARD.length})`);
    console.log("--- Comparison Results ---");
    console.log(`rawCard === TEST_CARD_NUMBER: ${rawCard === TEST_CARD_NUMBER}`);
    console.log(`cvv === TEST_CVV: ${cvv === TEST_CVV}`);
    console.log(`nameOnCard.trim() === TEST_NAME_ON_CARD: ${nameOnCard.trim() === TEST_NAME_ON_CARD}`); // Use trim for comparison
    console.log("-------------------------------------");
    // --- DEBUGGING LOGS END HERE ---


    // Validation for 16 digits
    if (!/^\d{16}$/.test(rawCard)) {
      setPaymentError("Please enter a valid 16-digit card number.");
      return;
    }
    
    // Expiry date validation
    if (isNaN(parseInt(expMonth)) || isNaN(parseInt(expYear))) {
      setPaymentError("Please enter both expiry month and year.");
      return;
    }

    const inputExpYear = parseInt(expYear);
    const inputExpMonth = parseInt(expMonth);

    // Get current year and month for comparison
    const today = new Date();
    const currentFullYear = today.getFullYear();
    const currentActualMonth = today.getMonth() + 1; // getMonth() is 0-indexed

    if (inputExpYear < currentFullYear || (inputExpYear === currentFullYear && inputExpMonth < currentActualMonth)) {
      setPaymentError("Card has expired.");
      return;
    }

    // CVV validation
    if (cvv.length < 3 || cvv.length > 4 || !/^\d+$/.test(cvv)) {
      setPaymentError("Please enter a valid 3 or 4 digit CVV.");
      return;
    }

    // Name on card validation
    if (nameOnCard.trim() === '') {
      setPaymentError("Please enter the name on the card.");
      return;
    }

    // *** IMPORTANT: Custom test validation (check for strict equality) ***
    // Ensure that the rawCard (cleaned from spaces) is compared with the raw TEST_CARD_NUMBER
    // Added .trim() to nameOnCard for robust comparison
    if (rawCard !== TEST_CARD_NUMBER || cvv !== TEST_CVV || nameOnCard.trim() !== TEST_NAME_ON_CARD) {
        setPaymentError("Invalid card details for testing. Please use the sample card number, CVV, and name.");
        return;
    }

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            setPaymentError("You must be logged in to make a payment.");
            navigate('/signin'); // Redirect to login if no token (corrected from /login in previous response)
            return;
        }

        // 1. Initiate Payment (simulated)
        const paymentResponse = await axios.post('http://localhost:5000/api/payment/process', {
            cardNumber: rawCard, // Send the raw (unformatted) card number to the backend
            expMonth: expMonth,
            expYear: expYear,
            cvv: cvv,
            nameOnCard: nameOnCard.trim(), // Send trimmed name to backend for consistency
            amount: 100.00, // You would dynamically calculate the total amount from the cart
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // If payment is successful (simulated response from backend)
        if (paymentResponse.data.success) {
            alert("Payment successful! Your purchased books are now available in your dashboard.");

            // 2. Clear user's cart after successful payment
            await axios.delete('http://localhost:5000/api/cart/clear', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Cart cleared after successful payment.');

            // 3. Mark books as purchased for the user
            // This is crucial for showing them in the dashboard
            // We need to send the list of bookIds from the cart to the backend
            // First, fetch current cart items to get their bookIds
            const cartResponse = await axios.get('http://localhost:5000/api/cart', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const bookIdsToPurchase = cartResponse.data.map(item => item.bookId);

            await axios.post('http://localhost:5000/api/users/add-purchased-books', {
                bookIds: bookIdsToPurchase
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Books marked as purchased for user.');


            navigate('/dashboard'); // Redirect to dashboard after successful payment and purchase update
        } else {
            setPaymentError(paymentResponse.data.message || "Payment failed. Please check your details.");
        }

    } catch (error) {
        console.error("Payment submission error:", error.response ? error.response.data : error.message);
        setPaymentError(error.response?.data?.message || "Payment failed. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className="payment-page-container"> {/* Wrapper div for layout */}
        <form className="payment-form" onSubmit={handlePaymentSubmit}>
          <fieldset className="card-fieldset">
            <legend>Pay with</legend>
            <div className="card-logos">
              <img className="card-logo" src="/assets/mastercard-26149.png" alt="MasterCard" /> {/* Adjusted path */}
              <img className="card-logo" src="/assets/visa-logo-png-2029.png" alt="Visa" /> {/* Adjusted path */}
              <img className="card-logo" src="/assets/paypal-logo-png-2140.png" alt="PayPal" /> {/* Adjusted path */}
            </div>

            <div className="form-group">
              <label htmlFor="card-number">Card Number</label>
              <input
                type="text"
                id="card-number"
                name="card-number"
                maxLength="19"
                placeholder="1234 5678 9012 3456"
                required
                value={cardNumber}
                onChange={handleCardNumberChange}
              />
            </div>

            <div className="expiry-container">
              <div className="expiry-field">
                <label htmlFor="exp-month">Exp Month</label>
                <select
                  id="exp-month"
                  name="exp-month"
                  required
                  value={expMonth}
                  onChange={(e) => setExpMonth(e.target.value)}
                >
                  <option value="">-- Select Month --</option>
                  <option value="01">01 - January</option>
                  <option value="02">02 - February</option>
                  <option value="03">03 - March</option>
                  <option value="04">04 - April</option>
                  <option value="05">05 - May</option>
                  <option value="06">06 - June</option>
                  <option value="07">07 - July</option>
                  <option value="08">08 - August</option>
                  <option value="09">09 - September</option>
                  <option value="10">10 - October</option>
                  <option value="11">11 - November</option>
                  <option value="12">12 - December</option>
                </select>
              </div>

              <div className="expiry-field">
                <label htmlFor="exp-year">Exp Year</label>
                <select
                  id="exp-year"
                  name="exp-year"
                  required
                  value={expYear}
                  onChange={(e) => setExpYear(e.target.value)}
                >
                  <option value="">-- Select Year --</option>
                  {generateYearOptions().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="cvv">CVV</label>
              <input
                type="text" // Changed to text to handle length more flexibly before conversion to number
                id="cvv"
                name="cvv"
                maxLength="4" // CVV can be 3 or 4 digits
                placeholder="123"
                required
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))} // Allow only digits
              />
            </div>

            <div className="form-group">
              <label htmlFor="name-on-card">Name on Card</label>
              <input
                type="text"
                id="name-on-card"
                name="name-on-card"
                placeholder="John Doe"
                required
                value={nameOnCard}
                onChange={(e) => setNameOnCard(e.target.value)}
              />
            </div>

            {paymentError && <p className="payment-error">{paymentError}</p>}

            <div className="Pay-button-container"> {/* Renamed for clarity */}
              <button type="submit" className="pay-button">Pay</button>
            </div>
          </fieldset>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default Payment;