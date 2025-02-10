import { useState } from "react";
import { Menu, Home, Calendar, Grid } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md p-4 fixed w-full top-0 z-50">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        {/* Logo / Brand */}
        <h1 className="text-2xl font-bold text-gray-800">TripPlanner</h1>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-200 transition">
          <Menu size={24} />
        </button>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-6">
          <NavItem to="/" icon={<Home size={20} />} label="Home" />
          <NavItem to="/itinerary" icon={<Calendar size={20} />} label="Itinerary" />
          <NavItem to="/dashboard" icon={<Grid size={20} />} label="Dashboard" />
        </ul>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-4 top-14 bg-white shadow-lg rounded-lg p-4 space-y-3 w-48 md:hidden transition-all">
          <NavItem to="/" icon={<Home size={18} />} label="Home" onClick={() => setIsOpen(false)} />
          <NavItem to="/itinerary" icon={<Calendar size={18} />} label="Itinerary" onClick={() => setIsOpen(false)} />
          <NavItem to="/dashboard" icon={<Grid size={18} />} label="Dashboard" onClick={() => setIsOpen(false)} />
        </div>
      )}
    </nav>
  );
}

function NavItem({ to, icon, label, onClick }) {
  return (
    <li>
      <Link
        to={to}
        onClick={onClick}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-100 transition-all"
      >
        {icon}
        <span>{label}</span>
      </Link>
    </li>
  );
}
