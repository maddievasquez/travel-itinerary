"use client"

import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Menu, Home, Calendar, LogOut, Settings, User } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600">TripPlanner</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavItem to="/" icon={<Home size={20} />} label="Home" />
              <NavItem to="/itinerary" icon={<Calendar size={20} />} label="Itinerary" />
            </div>
          </div>

          {/* Profile Dropdown (Desktop) */}
          <div className="hidden sm:flex sm:items-center">
            <ProfileDropdown dropdownOpen={dropdownOpen} setDropdownOpen={setDropdownOpen} />
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <NavItem to="/" icon={<Home size={20} />} label="Home" mobile />
            <NavItem to="/itinerary" icon={<Calendar size={20} />} label="Itinerary" mobile />
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <ProfileDropdown dropdownOpen={dropdownOpen} setDropdownOpen={setDropdownOpen} mobile />
          </div>
        </div>
      )}
    </nav>
  )
}

function NavItem({ to, icon, label, mobile = false }) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link
      to={to}
      className={`${
        mobile
          ? "block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          : "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
      } ${
        isActive
          ? "border-blue-500 text-blue-600"
          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
      } transition duration-150 ease-in-out`}
    >
      {icon && <span className={mobile ? "mr-3" : "mr-2"}>{icon}</span>}
      {label}
    </Link>
  )
}

function ProfileDropdown({ dropdownOpen, setDropdownOpen, mobile = false }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("userToken")
    navigate("/login")
    setDropdownOpen(false) // Ensure dropdown closes on logout
  }

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center focus:outline-none transition duration-150 ease-in-out"
      >
        <img className="h-8 w-8 rounded-full" src="/placeholder.svg?height=32&width=32" alt="User profile" />
        <span className={`${mobile ? "ml-3" : "hidden"} text-sm font-medium text-gray-700`}>John Doe</span>
      </button>

      {dropdownOpen && (
        <div
          className={`${
            mobile ? "static mt-3" : "origin-top-right absolute right-0 mt-2"
          } w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5`}
        >
         <Link
  to="/profile"
  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
  onClick={() => setDropdownOpen(false)}
>
  <User size={18} className="inline mr-2" />
  Your Profile
</Link>
<Link
  to="/profile"
  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
  onClick={() => setDropdownOpen(false)}
>
  <User size={18} className="inline mr-2" />
  Your Profile
</Link>
<Link
  to="/profile"
  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
  onClick={() => setDropdownOpen(false)}
>
  <User size={18} className="inline mr-2" />
  Your Profile
</Link>

          <Link
            to="/settings"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setDropdownOpen(false)}
          >
            <Settings size={18} className="inline mr-2" />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            <LogOut size={18} className="inline mr-2" />
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}



// import { useState } from "react";
// import { Menu, Home, Calendar, Grid } from "lucide-react";
// import { Link } from "react-router-dom";

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <nav className="bg-white shadow-md p-4 fixed w-full top-0 z-50">
//       <div className="flex justify-between items-center max-w-6xl mx-auto">
//         {/* Logo / Brand */}
//         <h1 className="text-2xl font-bold text-gray-800">TripPlanner</h1>

//         {/* Mobile Menu Toggle */}
//         <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-200 transition">
//           <Menu size={24} />
//         </button>

//         {/* Desktop Navigation */}
//         <ul className="hidden md:flex space-x-6">
//           <NavItem to="/" icon={<Home size={20} />} label="Home" />
//           <NavItem to="/itinerary" icon={<Calendar size={20} />} label="Itinerary" />
//           <NavItem to="/dashboard" icon={<Grid size={20} />} label="Dashboard" />
//         </ul>
//       </div>

//       {/* Mobile Dropdown Menu */}
//       {isOpen && (
//         <div className="absolute right-4 top-14 bg-white shadow-lg rounded-lg p-4 space-y-3 w-48 md:hidden transition-all">
//           <NavItem to="/" icon={<Home size={18} />} label="Home" onClick={() => setIsOpen(false)} />
//           <NavItem to="/itinerary" icon={<Calendar size={18} />} label="Itinerary" onClick={() => setIsOpen(false)} />
//           <NavItem to="/dashboard" icon={<Grid size={18} />} label="Dashboard" onClick={() => setIsOpen(false)} />
//         </div>
//       )}
//     </nav>
//   );
// }

// function NavItem({ to, icon, label, onClick }) {
//   return (
//     <li>
//       <Link
//         to={to}
//         onClick={onClick}
//         className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-100 transition-all"
//       >
//         {icon}
//         <span>{label}</span>
//       </Link>
//     </li>
//   );
// }
