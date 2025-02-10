export default function ScrollArea({ children, className = "" }) {
    return (
      <div className={`overflow-auto max-h-64 p-2 border rounded ${className}`}>
        {children}
      </div>
    );
  }
  