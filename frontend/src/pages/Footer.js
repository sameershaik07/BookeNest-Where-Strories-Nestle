import React from 'react';
import '../styles/Footer.css';  // make sure the path is correct

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-wrapper">
        {/* Branding Section */}
        <div className="footer-branding">
          <div className="brand-logo">
            {/* Replace with your logo or icon if needed */}
            <span className="icon-brand">📚</span>  
            <span className="brand-name">BookNest</span>
          </div>
          <p className="brand-description">
            Your favorite place to find and share amazing books.
          </p>
          <div className="social-buttons">
            {/* Social links can be added here */}
            <a href="facebook.com" className="social-btn" aria-label="Facebook">FB</a>
            <a href="x.com" className="social-btn" aria-label="Twitter">TW</a>
            <a href="instagram.com" className="social-btn" aria-label="Instagram">IG</a>
          </div>
        </div>

        {/* Links Section */}
        <div className="footer-links">
          <h3 className="footer-heading">Quick Links</h3>
          <ul>
            <li><a href="/" className="footer-link">Home</a></li>
            <li><a href="/about" className="footer-link">About</a></li>
            <li><a href="/top-picks" className="footer-link">Library</a></li>
            <li><a href="/contact" className="footer-link">Contact</a></li>
          </ul>
        </div>

        {/* Support Section */}
        <div className="footer-support">
          <h3 className="footer-heading">Support</h3>
          <ul>
            <li><a href="/faq" className="footer-link">FAQ</a></li>
            <li><a href="/help-center" className="footer-link">Help Center</a></li>
            <li><a href="/privacy-policy" className="footer-link">Privacy Policy</a></li>
            <li><a href="/terms-of-service" className="footer-link">Terms of Service</a></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="footer-contact">
          <h3 className="footer-heading">Contact Us</h3>
          <a href="mailto:support@booknest.com" className="contact-info">
            📧 support@booknest.com
          </a>
          <a href="tel:+1234567890" className="contact-info">
            📞 +91 74104 62083
          </a>
          <a href="tel:+1234567890" className="contact-info">
            📞 +91 95153 56474
          </a>
          <div className="contact-address">
            🏢 No. 18,Kurnool,Andhra Pradesh,India
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <small>© 2025 copyright. All rights reserved.</small>
        <div className="footer-bottom-links">
          <button className="footer-bottom-link" type="button">Privacy</button>
          <button className="footer-bottom-link" type="button">Terms</button>
          <button className="footer-bottom-link" type="button">Contact</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
