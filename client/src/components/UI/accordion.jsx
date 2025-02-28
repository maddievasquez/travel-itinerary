// src/components/ui/Accordion.jsx
import React, { useState } from "react";

const AccordionItem = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div
        className="cursor-pointer text-lg font-semibold text-gray-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
      </div>
      {isOpen && <div className="mt-2 text-sm">{children}</div>}
    </div>
  );
};

const Accordion = ({ children }) => {
  return <div>{children}</div>;
};

const AccordionTrigger = ({ children, onClick }) => {
  return (
    <div
      className="cursor-pointer text-lg font-semibold text-gray-700"
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const AccordionContent = ({ children }) => {
  return <div className="mt-2 text-sm">{children}</div>;
};

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
