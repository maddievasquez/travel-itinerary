import React from 'react';

function header() {
  return (
    <header style={headerStyle}>
      <div style={logoStyle}>Itinerary</div>
      <nav style={navStyle}>
        <a href="#login" style={linkStyle}>Log in</a>
        <a href="#signup" style={buttonStyle}>Sign up</a>
      </nav>
    </header>
  );
}

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px',
};

const logoStyle = { fontSize: '24px', color: '#90EE90' };
const navStyle = { display: 'flex', gap: '15px' };
const linkStyle = { textDecoration: 'none', color: '#000' };
const buttonStyle = {
  textDecoration: 'none',
  backgroundColor: '#90EE90',
  color: '#FFF',
  padding: '10px 20px',
  borderRadius: '5px',
};

export default header;
