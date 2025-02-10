export default function Textarea({ placeholder = "", value, onChange, className = "" }) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`border border-gray-300 p-2 rounded w-full h-32 focus:ring-2 focus:ring-blue-400 outline-none ${className}`}
    />
  );
}
