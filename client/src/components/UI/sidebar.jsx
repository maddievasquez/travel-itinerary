import { createContext, useContext, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(typeof window !== 'undefined' && window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function Sidebar({ children, className = "" }) {
  const { isOpen } = useContext(SidebarContext);
  return (
    <aside 
      className={`fixed lg:relative h-screen z-40 transition-all duration-300 ease-in-out ${
        isOpen ? "translate-x-0 w-80" : "-translate-x-full lg:translate-x-0 lg:w-20"
      } bg-white border-r border-gray-200 ${className}`}
    >
      <div className="h-full flex flex-col">
        {children}
      </div>
    </aside>
  );
}

export function SidebarHeader({ children, className = "" }) {
  const { isOpen } = useContext(SidebarContext);
  return (
    <div className={`p-4 border-b border-gray-200 bg-white font-semibold text-gray-800 ${className}`}>
      {isOpen ? children : <div className="flex justify-center">{typeof children === 'object' && children.props?.children?.[0]}</div>}
    </div>
  );
}

export function SidebarContent({ children, className = "" }) {
  return (
    <div className={`flex-1 overflow-y-auto ${className}`}>
      {children}
    </div>
  );
}

export function SidebarMenu({ children, className = "" }) {
  return <ul className={`space-y-1 ${className}`}>{children}</ul>;
}

export function SidebarMenuItem({ children, onClick, className = "", active }) {
  const { isOpen } = useContext(SidebarContext);
  return (
    <li 
      className={`cursor-pointer p-2 rounded-lg transition-all duration-200 ${
        active 
          ? "bg-teal-100 text-teal-800 border border-teal-200" 
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      } ${className}`} 
      onClick={onClick}
    >
      {isOpen ? children : (
        <div className="flex justify-center">
          {typeof children === 'object' && children.props?.children?.[0]?.props?.children?.[0]}
        </div>
      )}
    </li>
  );
}

export function SidebarTrigger({ className = "" }) {
  const { isOpen, setIsOpen } = useContext(SidebarContext);
  return (
    <button 
      className={`fixed top-4 left-4 z-50 p-2 rounded-full bg-white text-gray-800 hover:bg-gray-100 transition-all shadow-md border border-gray-200 ${className}`}
      onClick={() => setIsOpen(!isOpen)}
      aria-label={isOpen ? "Close Sidebar" : "Open Sidebar"}
    >
      {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
    </button>
  );
}