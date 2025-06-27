import React from 'react';

const Card = ({ title, description }) => {
  return (
    <div className="card" style={{ border: '1px solid #ccc', padding: '15px', margin: '10px' }}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default Card;
