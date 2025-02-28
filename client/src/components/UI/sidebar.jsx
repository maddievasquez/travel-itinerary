// src/components/ui/Sidebar.jsx
import React from "react";

const Sidebar = ({ children, className }) => {
  return (
    <div className={`bg-gray-800 text-white w-1/4 p-4 ${className}`}>
      {children}
    </div>
  );
};

export default Sidebar;
