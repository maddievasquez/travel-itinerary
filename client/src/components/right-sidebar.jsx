import React from "react";
import { Link } from "react-router-dom";
import { User, Bell, LogOut } from "lucide-react";

export function RightSidebar() {
  return (
    <div className="w-64 bg-gray-100 h-screen p-4 hidden lg:block">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-300 mr-2"></div>
        <div>
          <p className="text-sm font-medium">Traveler</p>
          <p className="text-xs text-gray-500">traveler@example.com</p>
        </div>
      </div>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link to="/profile" className="flex items-center p-2 hover:bg-gray-200 rounded">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </li>
          <li>
            <Link to="/notifications" className="flex items-center p-2 hover:bg-gray-200 rounded">
              <Bell className="mr-2 h-4 w-4" />
              <span>Notifications</span>
            </Link>
          </li>
          <li>
            <Link to="/logout" className="flex items-center p-2 hover:bg-gray-200 rounded">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}