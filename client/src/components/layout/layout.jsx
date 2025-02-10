import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar"; // Ensure correct path

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet /> {/* This will render the current page */}
      </main>
    </div>
  );
}
