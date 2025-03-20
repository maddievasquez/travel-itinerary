"use client";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, LogIn, LogOut, Settings, User } from "lucide-react";
import axios from "axios"; // Import axios
import destinationIcon from "../../assets/images/destination-1.svg"; // Import the SVG icon
import Cookie from "../cookies"; // Import the Cookie handler

// Function to get user initials
const getInitials = (name, email) => {
  if (name && typeof name === "string") return name.charAt(0).toUpperCase();
  if (email && typeof email === "string") return email.charAt(0).toUpperCase();
  return "?"; // Default when both are empty
};

// Define ProfileMenu before Navbar
function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null); // Updated state to store full user data
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = () => {
      const token = Cookie.getCookie("access");
      setIsLoggedIn(!!token);
    };

    checkToken();
    window.addEventListener("storage", checkToken);
    return () => {
      window.removeEventListener("storage", checkToken);
    };
  }, []);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = Cookie.getCookie("access"); // Ensure you have the token
        const response = await axios.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("User profile data:", response.data); // Debugging log
        setUserData(response.data); // Store user data properly
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    }

    if (isLoggedIn) {
      fetchProfile();
    } else {
      setLoading(false); // Set loading to false if not logged in
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    Cookie.deleteCookie("access");
    Cookie.deleteCookie("refresh");
    setIsLoggedIn(false);
    navigate("/login");
    setIsOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-10 h-10 text-lg font-semibold text-white bg-gray-400 rounded-full">
        ...
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center p-2 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
        id="user-menu"
        aria-haspopup="true"
      >
        <span className="flex items-center justify-center w-10 h-10 text-lg font-semibold text-white bg-blue-500 rounded-full">
          {getInitials(userData?.name, userData?.email)}
        </span>
      </button>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu"
        >
          {isLoggedIn ? (
            <>
              <Link
                to="/profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <User className="mr-3 h-4 w-4" /> Your Profile
              </Link>
              <Link
                to="/settings"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="mr-3 h-4 w-4" /> Settings
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
                role="menuitem"
              >
                <LogOut className="mr-3 h-4 w-4" /> Sign out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <LogIn className="mr-3 h-4 w-4" /> Log in
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

// Define MobileMenu before Navbar
function MobileMenu({ setIsOpen }) {
  return (
    <div className="sm:hidden bg-teal text-white py-2">
      <div className="pt-2 pb-3 space-y-1">
        <NavItem to="/" label="Home" />
        <NavItem to="/my-itineraries" label="My Itineraries" />
      </div>
    </div>
  );
}

// Define Navbar after ProfileMenu and MobileMenu
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-teal shadow-lg fixed w-full top-0 z-50 rounded-b-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img src={destinationIcon} alt="Destination Icon" className="h-20 w-20 mr-1" /> {/* Add the SVG icon */}
              <span className="text-2xl font-semibold text-white tracking-wider">Voyaroute</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavItem to="/" label="Home" />
              <NavItem to="/my-itineraries" label="My Itineraries" />
            </div>
          </div>

          <div className="hidden sm:flex sm:items-center">
            <ProfileMenu />
          </div>

          <div className="flex items-center sm:hidden">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-200 hover:bg-teal-light focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-300"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {isOpen && <MobileMenu setIsOpen={setIsOpen} />}
    </nav>
  );
}

// NavItem remains at the bottom
function NavItem({ to, label }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium transition-all duration-300 ${
        isActive
          ? "border-white text-white"
          : "border-transparent text-gray-200 hover:border-gray-300 hover:text-white"
      }`}
    >
      <span className="ml-2">{label}</span>
    </Link>
  );
}