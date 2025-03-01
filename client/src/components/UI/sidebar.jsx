import { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function Sidebar({ children }) {
  const { isOpen } = useContext(SidebarContext);
  return (
    <aside className={`transition-transform ${isOpen ? "translate-x-0" : "-translate-x-full"} w-64 bg-white border-r shadow-md`}>
      {children}
    </aside>
  );
}

export function SidebarHeader({ children }) {
  return <div className="p-4 border-b bg-gray-100 font-semibold">{children}</div>;
}

export function SidebarContent({ children }) {
  return <div className="p-4">{children}</div>;
}

export function SidebarMenu({ children }) {
  return <ul className="space-y-2">{children}</ul>;
}

export function SidebarMenuItem({ children, onClick }) {
  return (
    <li className="cursor-pointer p-2 hover:bg-gray-200 rounded-md transition" onClick={onClick}>
      {children}
    </li>
  );
}

export function SidebarTrigger() {
  const { isOpen, setIsOpen } = useContext(SidebarContext);
  return (
    <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-md transition" onClick={() => setIsOpen(!isOpen)}>
      {isOpen ? "Close Sidebar" : "Open Sidebar"}
    </button>
  );
}
