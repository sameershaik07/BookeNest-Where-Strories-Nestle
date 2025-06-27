import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../styles/Footer.css";

const PrivacyPolicy = () => {
  return (
    <>
      <Header />
      <main className="page-container">
        <h1>Privacy Policy</h1>
        <section className="content-section">
          <p>
            Your privacy is critically important to us. At BookNest, we respect your privacy and
            are committed to protecting your personal information.
          </p>
          <h2>Information We Collect</h2>
          <p>
            We collect information that you provide directly to us, such as account registration,
            profile data, and usage information.
          </p>
          <h2>How We Use Information</h2>
          <p>
            We use your information to provide, maintain, and improve our services, communicate with
            you, and ensure security.
          </p>
          <h2>Data Sharing</h2>
          <p>
            We do not share your personal data with third parties except where required by law or
            for service providers who assist us in operations.
          </p>
          <h2>Your Rights</h2>
          <p>
            You have the right to access, update, and delete your information. Contact us anytime for
            privacy concerns.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
