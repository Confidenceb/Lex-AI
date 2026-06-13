import { Link, useLocation } from "react-router-dom";
import { Scale, FileText } from "lucide-react";

export default function Header() {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 no-underline hover:opacity-80 transition-opacity">
            <Scale className="text-primary-light" size={24} />
            <span className="text-white font-semibold text-lg">LexAI</span>
          </Link>
          {!isLanding && (
            <Link
              to="/analyze"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-white text-sm font-medium no-underline hover:bg-primary-dark transition-colors"
            >
              <FileText size={14} />
              Analyze Contract
            </Link>
          )}
        </div>
        {!isLanding && (
          <Link
            to="/analyze"
            className="text-sm text-slate-400 no-underline hover:text-white transition-colors sm:hidden"
          >
            Analyze
          </Link>
        )}
      </div>
    </header>
  );
}
