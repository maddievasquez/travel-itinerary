import { ThemeProvider } from './Context/ThemeContext';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SingUpPage";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./components/user/UserProfile";
import MyItineraries from "./pages/MyItinerariesPage";
import ItineraryPage from "./components/itinerary/ItineraryPage";
import AboutPage from "./pages/AboutPage";
import WelcomePage from "./pages/WelcomePage";
import BookmarksPage from './pages/BookmarksPage';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

export default function AppRoutes() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          
          {/* Main Layout Routes */}
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/my-itineraries" element={<MyItineraries />} />
            <Route path="/itineraries/:id" element={<ItineraryPage />} />
          </Route>
          
          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}