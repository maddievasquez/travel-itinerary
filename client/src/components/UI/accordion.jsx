import { useState } from "react";

export function Accordion({ children }) {
  return <div className="space-y-2">{children}</div>;
}

export function AccordionItem({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border rounded-lg shadow-sm">
      <button
        className="w-full flex justify-between items-center p-3 text-left bg-gray-100 font-semibold hover:bg-gray-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && <div className="p-3">{children}</div>}
    </div>
  );
}

export function AccordionTrigger({ title, onClick }) {
  return (
    <button className="w-full text-left p-2 hover:bg-gray-100 rounded-md transition" onClick={onClick}>
      {title}
    </button>
  );
}

export function AccordionContent({ children }) {
  return <div className="p-3 border-t">{children}</div>;
}
