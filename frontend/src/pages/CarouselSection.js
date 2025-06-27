import React from "react";
import Card from "./Card";

const CarouselSection = ({ title, books }) => {
  return (
    <section className="carousel-section">
      <h2>{title}</h2>
      <div className="carousel">
        {books.map((book, index) => (
          <Card key={index} {...book} />
        ))}
      </div>
    </section>
  );
};

export default CarouselSection;
