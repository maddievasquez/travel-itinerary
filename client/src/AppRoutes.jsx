import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Layout from "./components/layout/layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SingUpPage";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./components/user/UserProfile";
import ItineraryPage from "./components/itinerary/Itinerary-Page";

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
      </Routes>
    </BrowserRouter>
  );
}
