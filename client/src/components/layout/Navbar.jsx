"use client"
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Menu, Home, LogOut, Settings, User } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600">TripPlanner</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavItem to="/" icon={<Home className="w-4 h-4" />} label="Home" />
              <NavItem to="/my-itineraries" icon={<Home className="w-4 h-4" />} label="My Itineraries" />
            </div>
          </div>

          <div className="hidden sm:flex sm:items-center">
            <ProfileMenu />
          </div>

          <div className="flex items-center sm:hidden">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
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
  )
}

function NavItem({ to, icon, label }) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link
      to={to}
      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
        isActive
          ? "border-blue-500 text-blue-600"
          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
      }`}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </Link>
  )
}

function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("userToken")
    navigate("/login")
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        id="user-menu"
        aria-haspopup="true"
      >
        <img className="h-8 w-8 rounded-full" src="/placeholder.svg?height=32&width=32" alt="User profile" />
      </button>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu"
        >
          <Link
            to="/profile"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            <User className="mr-3 h-4 w-4" />
            Your Profile
          </Link>
          <Link
            to="/settings"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="mr-3 h-4 w-4" />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
            role="menuitem"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

function MobileMenu({ setIsOpen }) {
  return (
    <div className="sm:hidden">
      <div className="pt-2 pb-3 space-y-1">
        <MobileNavItem to="/" icon={<Home className="w-4 h-4" />} label="Home" setIsOpen={setIsOpen} />
        <MobileNavItem
          to="/my-itineraries"
          icon={<Home className="w-4 h-4" />}
          label="My Itineraries"
          setIsOpen={setIsOpen}
        />
      </div>
      <div className="pt-4 pb-3 border-t border-gray-200">
        <div className="flex items-center px-4">
          <div className="flex-shrink-0">
            <img className="h-10 w-10 rounded-full" src="/placeholder.svg?height=40&width=40" alt="User profile" />
          </div>
          <div className="ml-3">
            <div className="text-base font-medium text-gray-800">John Doe</div>
            <div className="text-sm font-medium text-gray-500">john@example.com</div>
          </div>
        </div>
        <div className="mt-3 space-y-1">
          <MobileMenuItem
            to="/profile"
            icon={<User className="w-4 h-4" />}
            label="Your Profile"
            setIsOpen={setIsOpen}
          />
          <MobileMenuItem
            to="/settings"
            icon={<Settings className="w-4 h-4" />}
            label="Settings"
            setIsOpen={setIsOpen}
          />
          <MobileMenuItem
            to="/login"
            icon={<LogOut className="w-4 h-4" />}
            label="Sign out"
            onClick={() => {
              localStorage.removeItem("userToken")
              setIsOpen(false)
            }}
            className="text-red-600"
          />
        </div>
      </div>
    </div>
  )
}

function MobileNavItem({ to, icon, label, setIsOpen }) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link
      to={to}
      className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
        isActive
          ? "bg-blue-50 border-blue-500 text-blue-700"
          : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
      }`}
      onClick={() => setIsOpen(false)}
    >
      <div className="flex items-center">
        {icon}
        <span className="ml-3">{label}</span>
      </div>
    </Link>
  )
}

function MobileMenuItem({ to, icon, label, onClick, className = "", setIsOpen }) {
  return (
    <Link
      to={to}
      className={`block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 ${className}`}
      onClick={() => {
        if (onClick) onClick()
        setIsOpen(false)
      }}
    >
      <div className="flex items-center">
        {icon}
        <span className="ml-3">{label}</span>
      </div>
    </Link>
  )
}
