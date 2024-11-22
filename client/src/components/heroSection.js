import React from 'react';

function heroSection() {
  return (
    <section style={heroStyle}>
      <div style={textSection}>
        <h1 style={titleStyle}>A travel planner for everyone</h1>
        <p style={paragraphStyle}>
          Organize flights & hotels and map your trips in a free travel app designed for
          vacation planning & road trips, powered by AI and Google Maps.
        </p>
        <div style={buttonContainer}>
          <a href="#start" style={startButton}>Start planning</a>
        </div>
      </div>
      <div style={imageSection}>
      <img src="travel_logo.jpg" alt="Travel Planner" style={imageStyle} />
      </div>
    </section>
  );
}

const heroStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '50px',
};

const textSection = { flex: 1, marginRight: '50px' };
const titleStyle = { fontSize: '36px', fontWeight: 'bold' };
const paragraphStyle = { fontSize: '18px', margin: '20px 0' };
const buttonContainer = { display: 'flex', gap: '15px' };
const startButton = {
  textDecoration: 'none',
  backgroundColor: '#90EE90',
  color: '#FFF',
  padding: '10px 20px',
  borderRadius: '5px',
};
const appButton = {
  textDecoration: 'none',
  backgroundColor: '#FFF',
  border: '1px solid #FF6B6B',
  color: '#FF6B6B',
  padding: '10px 20px',
  borderRadius: '5px',
};
const imageSection = { flex: 1 };
const imageStyle = { width: '100%', borderRadius: '10px' };

export default heroSection;
