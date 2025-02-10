export default function Label({ htmlFor, children, className = "" }) {
  return (
    <label htmlFor={htmlFor} className={`font-semibold text-gray-700 ${className}`}>
      {children}
    </label>
  );
}
