import { Link, useLocation } from "react-router-dom";
import { Scale } from "lucide-react";

export default function Header() {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <header className="glass" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 no-underline hover:opacity-80 transition-opacity">
          <Scale className="text-primary-light" size={24} />
          <span className="text-white font-semibold text-lg">LexAI</span>
        </Link>
        {!isLanding && (
          <Link
            to="/analyze"
            className="text-sm text-slate-400 no-underline hover:text-white transition-colors"
          >
            Analyze Contract
          </Link>
        )}
      </div>
    </header>
  );
}
