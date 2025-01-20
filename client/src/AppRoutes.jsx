import React, { Component } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SingUpPage";

class AppRoutes extends Component {
    render() {
      return (
        <BrowserRouter>
            <Routes>
              <Route path="/" element={< HomePage/>} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Routes>

  
        </BrowserRouter>
      );
    }
  }
  
  export default AppRoutes