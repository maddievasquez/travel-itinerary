import React, { Component } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import LoginPage from "./components/Login/LoginPage";

class AppRoutes extends Component {
    render() {
      return (
        <BrowserRouter>
          <MainContainer>
            <Routes>
              {/* <Route path="/" element={<Homepage />} /> */}
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </MainContainer>

  
        </BrowserRouter>
      );
    }
  }
  
  export default AppRoutes