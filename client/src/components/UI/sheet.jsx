export default function Sheet({ children }) {
  return <div className="fixed inset-0 bg-gray-900 bg-opacity-50">{children}</div>;
}

export function SheetTrigger({ children, onClick }) {
  return (
    <button onClick={onClick} className="text-blue-500 hover:text-blue-700">
      {children}
    </button>
  );
}

export function SheetContent({ children }) {
  return <div className="absolute right-0 w-64 bg-white shadow-lg p-4">{children}</div>;
}
