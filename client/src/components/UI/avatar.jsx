export function Avatar({ children, className = "" }) {
    return <div className={`w-12 h-12 rounded-full overflow-hidden border ${className}`}>{children}</div>;
  }
  
  export function AvatarImage({ src, alt = "Avatar" }) {
    return <img src={src} alt={alt} className="w-full h-full object-cover" />;
  }
  
  export function AvatarFallback({ text = "?" }) {
    return <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600">{text}</div>;
  }
  