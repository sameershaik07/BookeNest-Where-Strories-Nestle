import React, { useState } from "react";
import "../styles/Footer.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Header from "./Header";
import Footer from "./Footer";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "What is BookNest?",
      answer:
        "BookNest is an online platform that helps readers discover, read, and track their favorite books across various genres."
    },
    {
      question: "How can I create an account?",
      answer:
        "Click the Sign Up button at the top-right corner, fill in your details, and you're all set to explore BookNest!"
    },
    {
      question: "Is there a mobile version available?",
      answer:
        "Yes! BookNest is fully responsive and works smoothly on all mobile devices. A dedicated app is also coming soon."
    },
    {
      question: "Can I share my reading list with friends?",
      answer:
        "Yes, you can create public reading lists and share them with friends or through social media directly from your profile."
    }
  ];

  return (
    <>
      <Header />
      <div className="faq-page">
        <div className="faq-container">
          <h1>Frequently Asked Questions</h1>
          <div className="faq-list">
            {faqData.map((item, index) => (
              <div
                key={index}
                className={`faq-card ${openIndex === index ? "active" : ""}`}
                onClick={() => toggleFAQ(index)}
              >
                <div className="faq-card-header">
                  <h3>{item.question}</h3>
                  {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                {openIndex === index && (
                  <div className="faq-card-body">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FAQ;
