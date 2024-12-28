import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

function header() {
  return (
    <header style={headerStyle}>
      <div style={logoStyle}>Itinerary</div>
      <nav style={navStyle}>

        {/* Replace href with Link to for routing */}
        
        {/* <Link to="/Home" style={linkStyle}>Home</Link> */}
        <Link to="/login" style={linkStyle}>Log in</Link>
         <Link to="/signup" style={buttonStyle}>Sign up</Link>

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

const logoStyle = { fontSize: '24px', color: '#65B891' };
const navStyle = { display: 'flex', gap: '15px' };
const linkStyle = { textDecoration: 'none', color: '#000' };
const buttonStyle = {
  textDecoration: 'none',
  backgroundColor: '#65B891',
  color: '#FFF',
  padding: '10px 20px',
  borderRadius: '5px',
};

export default header;


