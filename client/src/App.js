// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; //Router setup
// import './App.css';
// import Header from './components/header.js';
// import HeroSection from './components/heroSection.js';
// import Footer from "./components/footer.js";
// import LoginPage from "./components/loginPage.js";

// function App() {
//   return (
//     <><div className="App">
//       <Header />

//       <div>
//             <LoginPage />
//         </div>

//       <HeroSection />
//     </div><div>
//         <div
//           style={{
//             minHeight: "400px",
//             color: "green",
//           }}
//         >
//         {/* <h1>GeeksforGeeks</h1> */}
//         </div>
//         <Footer />
//       </div></>
//   );
// }

// export default App;



// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Router setup
// import './App.css';
// import Header from './components/header.js';
// import HeroSection from './components/heroSection.js';
// import Footer from './components/footer.js';
// import LoginPage from './components/loginPage.js';

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         {/* Header */}
//         <Header />

//         {/* Navigation Menu */}
//         <nav style={{ margin: '20px', textAlign: 'center' }}>
//           <Link to="/" className="nav-link" style={{ marginRight: '20px' }}>Home</Link>
//           <Link to="/login" className="nav-link">Login</Link>
//         </nav>

//         {/* Routes for Different Pages */}
//         <Routes>
//           <Route path="/" element={<HeroSection />} /> {/* Home */}
//           <Route path="/login" element={<LoginPage />} /> {/*Login Page */}
//           </Routes>

//           {/* Footer */}
//          <Footer />
//         </div>
//     </Router>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // React Router setup
import './App.css';
import Header from './components/header';
import HeroSection from './components/heroSection';
import Footer from './components/footer';
import LoginPage from './components/loginPage';
//import SignupPage from './components/signupPage'; // Optional: Add SignupPage

function App() {
  return (
    
    <Router>
      <div className="App">
        {/* Header */}
        <Header />

        {/* Routes to handle navigation */}
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<HeroSection />} />

          {/* Login Page */}
          <Route path="/login" element={<LoginPage />} />
          
        </Routes> 

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;

