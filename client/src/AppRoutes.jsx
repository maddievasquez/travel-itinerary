import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SingUpPage";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./components/user/UserProfile";
import Layout from "./components/layout/layout"; // Import Layout

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Wrap main pages inside Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<UserProfile />} />
        </Route>

        {/* Pages that DON'T need Navbar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
