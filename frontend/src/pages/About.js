import React from "react";
import "../styles/About.css";
import Header from "./Header";
import Footer from "./Footer";

const About = () => {
  return (
    <>
      <Header />
      <div className="about-page">
        <div className="about-container">
          <h1>About BookNest</h1>
          <p>
            BookNest is an online sanctuary for readers who want to explore, track,
            and share their reading journey. Whether you love fiction, poetry,
            thrillers, or self-help — we’ve got you covered.
          </p>

          <h2>Our Vision</h2>
          <p>
            We believe stories bring people together. BookNest aims to build a global
            reading community that thrives on knowledge, imagination, and creativity.
          </p>

          <h2>Features</h2>
          <ul>
            <li>Track your reading progress</li>
            <li>Create and share reading lists</li>
            <li>Discover new books every day</li>
            <li>Mobile-first responsive design</li>
          </ul>

          <h2>Join Us</h2>
          <p>
            Be a part of the BookNest family. Sign up today and take your reading
            experience to the next level!
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;
