import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../styles/Footer.css";

const TermsOfService = () => {
  return (
    <>
      <Header />
      <main className="page-container">
        <h1>Terms of Service</h1>
        <section className="content-section">
          <p>Welcome to BookNest. By accessing or using our services, you agree to the following terms and conditions.</p>
          <h2>Use of Service</h2>
          <p>You agree to use BookNest responsibly and comply with all applicable laws.</p>
          <h2>Account Responsibility</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials.</p>
          <h2>Intellectual Property</h2>
          <p>All content and software provided are owned or licensed by BookNest.</p>
          <h2>Termination</h2>
          <p>We reserve the right to suspend or terminate accounts violating these terms.</p>
          <h2>Changes to Terms</h2>
          <p>We may update these terms from time to time; continued use signifies acceptance.</p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default TermsOfService;
