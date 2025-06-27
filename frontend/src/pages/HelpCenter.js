import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../styles/Footer.css";

const HelpCenter = () => {
  return (
    <>
      <Header />
      <main className="page-container">
        <h1>Help Center</h1>
        <section className="content-section">
          <p>Welcome to the BookNest Help Center. Here you can find answers and support for common questions.</p>
          <h2>Account Issues</h2>
          <p>If you’re having trouble logging in or managing your account, try resetting your password or contact support.</p>
          <h2>Using BookNest</h2>
          <p>Learn how to discover new books, create reading lists, and share with friends.</p>
          <h2>Technical Support</h2>
          <p>If you encounter bugs or errors, please report them to our support team for prompt assistance.</p>
          <h2>Contact Support</h2>
          <p>You can reach us via email at support@booknest.com or through the contact form on our site.</p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default HelpCenter;
