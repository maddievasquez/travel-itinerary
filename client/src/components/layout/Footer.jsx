import { Link } from "react-router-dom";
import { Info, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#2C3E50] text-white border-t w-full py-4">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Navigation */}
        <div className="flex items-center gap-6">
          <FooterLink to="/about" icon={<Info size={16} />} label="About" />
          <FooterLink to="/contact" icon={<Mail size={16} />} label="Contact" />
        </div>

        {/* Copyright */}
        <p className="text-xs">© {new Date().getFullYear()} Voyaroute</p>
      </div>
    </footer>
  );
}

function FooterLink({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center text-[#2B8D8D] text-sm hover:text-[#FF6F61] transition-colors"
    >
      {icon}
      <span className="ml-1.5">{label}</span>
    </Link>
  );
}
