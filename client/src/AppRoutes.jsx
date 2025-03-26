import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Layout from "./components/layout/layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SingUpPage";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./components/user/UserProfile";
import ItineraryPage from "./components/itinerary/Itinerary-Page";
import ForgotPassword from "./components/user/ForgotPassword";
import ResetPassword from "./components/user/ResetPassword";
import ItineraryDetail from './components/itinerary/ItineraryDetail';
import MyItineraries from './pages/MyItinerariesPage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="/itinerary" element={<ItineraryPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/itineraries" element={<MyItineraries />} />
        <Route path="/itinerary/:id" element={<ItineraryDetail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}
