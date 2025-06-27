import React from "react";
import "../styles/Children.css";

export default function TopCategory() {
  return (
    <div className="category-container">
      <h1 className="stylish-title">
        <span className="title-accent">BookNest</span> Categories
      </h1>
      <main>
        <div className="top-category-grid">
          <a href="/categories/children" className="top-category-card children">
            <span>Children's Books</span>
          </a>
          <a href="/categories/fiction" className="top-category-card fiction">
            <span>Fiction</span>
          </a>
          <a href="/categories/nonfiction" className="top-category-card nonfiction">
            <span>Non-Fiction</span>
          </a>
        </div>
      </main>
    </div>
  );
}