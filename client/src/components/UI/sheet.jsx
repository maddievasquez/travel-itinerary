export default function Sheet({ children, className = "" }) {
    return (
      <div className={`fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 ${className}`}>
        <div className="bg-white w-80 h-full shadow-lg p-4">{children}</div>
      </div>
    );
  }
  