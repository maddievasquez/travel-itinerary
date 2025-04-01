"use client";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, LogIn, LogOut, Settings, User, ChevronDown } from "lucide-react";
import destinationIcon from "../../assets/images/destination-1.svg";
import Cookie from "../cookies";
import { fetchProfile, logout } from "../../services/auth";

// Function to get user initials
const getInitials = (name, email) => {
  if (name && typeof name === "string") return name.charAt(0).toUpperCase();
  if (email && typeof email === "string") return email.charAt(0).toUpperCase();
  return "?";
};

function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  
  // Handle clicks outside of dropdown to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Check authentication status on mount and when token changes
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = Cookie.getCookie("access");
        if (token) {
          try {
            const profile = await fetchProfile();
            setUserData(profile);
          } catch (profileError) {
            // Handle error details
            console.error("Profile fetch error:", profileError);
            
            if (profileError.response?.status === 404) {
              setError("Profile endpoint not found. Check API configuration.");
            } else if (profileError.response?.status === 401) {
              // Token expired or invalid
              Cookie.logoutClickHandler();
              navigate("/login");
            } else {
              setError(profileError.message || "Failed to load profile");
            }
          }
        } else {
          // No token, user is not logged in
          setUserData(null);
        }
      } catch (err) {
        console.error("Auth check error:", err);
        setError("Authentication error");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    
    // Add an event listener for cookie changes
    const checkCookieChange = setInterval(() => {
      const isAuthenticated = !!Cookie.getCookie("access");
      if (!isAuthenticated && userData) {
        setUserData(null);
      }
    }, 1000);
    
    return () => clearInterval(checkCookieChange);
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      setUserData(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      setError(err.message);
    } finally {
      setIsOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-10 h-10 text-lg font-semibold text-white bg-gray-400 rounded-full animate-pulse">
        <span className="sr-only">Loading</span>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-teal-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-300 transition-all duration-300 hover:bg-teal-600"
        id="user-menu"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="flex items-center justify-center w-8 h-8 text-sm font-semibold text-teal-700 bg-white rounded-full">
          {userData ? getInitials(userData.username || userData.name, userData.email) : "?"}
        </span>
        <span className="hidden md:block text-sm font-medium">
          {userData ? (userData.first_name || userData.username || "Account") : "Sign In"}
        </span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-lg py-2 bg-white ring-1 ring-black ring-opacity-5 z-50 transition-all duration-200 ease-out transform"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu"
        >
          {userData && (
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userData.first_name && userData.last_name 
                  ? `${userData.first_name} ${userData.last_name}`
                  : userData.username || userData.email}
              </p>
              <p className="text-xs text-gray-500 truncate mt-1">
                {userData.email}
              </p>
            </div>
          )}
          
          {userData ? (
            <>
              <Link
                to="/profile"
                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <User className="mr-3 h-4 w-4 text-teal-600" /> 
                <span>Profile</span>
              </Link>
              <Link
                to="/profile"
                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                role="menuitem"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/profile', { state: { activeTab: 'settings' } });
                }}
              >
                <Settings className="mr-3 h-4 w-4 text-teal-600" /> 
                <span>Settings</span>
              </Link>
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-sm text-left text-red-600 hover:bg-gray-50 transition-colors duration-150"
                role="menuitem"
              >
                <LogOut className="mr-3 h-4 w-4" /> 
                <span>Sign out</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <LogIn className="mr-3 h-4 w-4 text-teal-600" /> 
              <span>Log in</span>
            </Link>
          )}
        </div>
      )}
      {error && (
        <div className="absolute right-0 mt-2 p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg shadow-md">
          {error}
        </div>
      )}
    </div>
  );
}

function MobileMenu({ isOpen, setIsOpen, isAuthenticated }) {
  const location = useLocation();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="sm:hidden bg-teal-600 text-white py-2 px-2 rounded-b-lg shadow-lg">
      <div className="pt-2 pb-3 space-y-1">
        <NavItem to="/" label="Home" onClick={() => setIsOpen(false)} />
        {isAuthenticated && (
          <>
            <NavItem to="/my-itineraries" label="My Itineraries" onClick={() => setIsOpen(false)} />
            <NavItem to="/profile" label="Profile" onClick={() => setIsOpen(false)} />
            <div 
              className="inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium border-transparent text-gray-200 hover:border-gray-300 hover:text-white cursor-pointer"
              onClick={() => {
                setIsOpen(false);
                navigate('/profile', { state: { activeTab: 'settings' } });
              }}
            >
              Settings
            </div>
          </>
        )}
        {!isAuthenticated && (
          <NavItem to="/login" label="Log In" onClick={() => setIsOpen(false)} />
        )}
      </div>
    </div>
  );
}

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  
  // Check authentication status on mount and when location changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = Cookie.getCookie("access");
      setIsAuthenticated(!!token);
    };
    
    checkAuthStatus();
    
    // Recheck auth status when location changes
    const interval = setInterval(checkAuthStatus, 1000);
    
    return () => clearInterval(interval);
  }, [location]);

  return (
    <nav className="bg-gradient-to-r from-teal-600 to-teal-500 shadow-lg fixed w-full top-0 z-50 rounded-b-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img 
                src={destinationIcon} 
                alt="Destination Icon" 
                className="h-20 w-20 mr-1" 
              />
              <span className="text-2xl font-semibold text-white tracking-wider">
                Voyaroute
              </span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavItem to="/" label="Home" />
              {isAuthenticated && (
                <NavItem to="/my-itineraries" label="My Itineraries" />
              )}
            </div>
          </div>

          <div className="hidden sm:flex sm:items-center">
            <ProfileMenu />
          </div>

          <div className="flex items-center sm:hidden">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-200 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-300 transition-all duration-200"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      <MobileMenu 
        isOpen={isMobileOpen} 
        setIsOpen={setIsMobileOpen} 
        isAuthenticated={isAuthenticated} 
      />
    </nav>
  );
}

function NavItem({ to, label, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium transition-all duration-300 ${
        isActive
          ? "border-white text-white"
          : "border-transparent text-gray-200 hover:border-gray-300 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
}