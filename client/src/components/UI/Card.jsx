export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children }) {
  return <div className="border-b pb-2 mb-2">{children}</div>;
}

export function CardTitle({ children }) {
  return <h3 className="text-lg font-semibold">{children}</h3>;
}

export function CardContent({ children }) {
  return <div>{children}</div>;
}

export function CardFooter({ children }) {
  return <div className="border-t pt-2 mt-2 text-sm text-gray-600">{children}</div>;
}

export function CardDescription({ children }) {
  return <p className="text-gray-500">{children}</p>;
}
