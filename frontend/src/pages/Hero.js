import React, { useState, useRef } from "react";

const Hero = () => {
  const [searchVisible, setSearchVisible] = useState(false);
  const inputRef = useRef(null);

  const toggleSearch = () => {
    setSearchVisible((prev) => !prev);
    setTimeout(() => {
      if (inputRef.current && !searchVisible) {
        inputRef.current.focus();
      }
    }, 100);
  };

  return (
    <div className="hero">
      <div className="hero-content">
        <h2>Your Story Starts Here</h2>
        <p>Discover gripping tales and timeless classics handpicked for readers like you.</p>
        <div className="browse-container">
          <button onClick={toggleSearch} className="browse-button">
            Browse Now
          </button>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search books..."
            className={`search-input ${searchVisible ? "show" : ""}`}
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
