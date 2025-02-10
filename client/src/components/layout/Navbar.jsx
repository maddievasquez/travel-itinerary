"use client";

import { useState } from "react";
import { Menu, Home, LayoutDashboard, Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

const navItems = [
  { name: "Home", view: "home", icon: Home },
  { name: "Itinerary", view: "itinerary", icon: Calendar },
  { name: "Dashboard", view: "dashboard", icon: LayoutDashboard },
];

export default function Navbar({ onNavigate, currentView }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="p-0 text-white">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[250px] sm:w-[300px]">
        <nav className="flex flex-col space-y-4 mt-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href="#"
              className={`text-lg font-medium transition-colors flex items-center ${
                currentView === item.view
                  ? "text-blue-600 font-bold"
                  : "text-gray-700 hover:text-blue-600"
              }`}
              onClick={() => {
                onNavigate(item.view);
                setIsOpen(false);
              }}
            >
              <item.icon className="mr-2 h-5 w-5" />
              {item.name}
              {currentView === item.view && (
                <span className="ml-2 text-blue-600">•</span>
              )}
            </a>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}