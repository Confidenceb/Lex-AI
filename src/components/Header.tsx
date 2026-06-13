import { Link } from "react-router-dom";
import { Scale, FileText } from "lucide-react";

export default function Header() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-[100]"
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(15, 23, 42, 0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div
          className="flex items-center gap-2 sm:gap-4 min-w-0"
          style={{ justifyContent: "space-between", width: "100%" }}
        >
          <Link
            to="/"
            className="flex items-center gap-2 no-underline hover:opacity-80 transition-opacity shrink-0"
          >
            <Scale className="text-primary-light" size={22} />
            <span className="text-white font-semibold text-base sm:text-lg">
              LexAI
            </span>
          </Link>
          <Link
            to="/analyze"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs sm:text-sm font-medium no-underline hover:bg-primary-dark transition-colors whitespace-nowrap"
          >
            <FileText size={13} />
            <span className="hidden sm:inline">Analyze Contract</span>
            <span className="sm:hidden">Analyze</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
