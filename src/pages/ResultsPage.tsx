import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { AnalysisResult, RiskLevel } from "../types";
import {
  AlertTriangle, AlertCircle, Info, Shield, BookOpen,
  Languages, Lightbulb, ArrowRight, RefreshCw, Download
} from "lucide-react";

const severityConfig = {
  high: { icon: AlertCircle, color: "text-red-400", border: "border-red-500/20", bg: "bg-red-500/5" },
  medium: { icon: AlertTriangle, color: "text-yellow-400", border: "border-yellow-500/20", bg: "bg-yellow-500/5" },
  low: { icon: Info, color: "text-blue-400", border: "border-blue-500/20", bg: "bg-blue-500/5" },
};

const riskConfig: Record<RiskLevel, { color: string; label: string; ring: string }> = {
  high: { color: "text-red-400", label: "High Risk", ring: "#ef4444" },
  medium: { color: "text-yellow-400", label: "Medium Risk", ring: "#eab308" },
  low: { color: "text-emerald-400", label: "Low Risk", ring: "#34d399" },
};

function RiskScoreCard({ score, level }: { score: number; level: RiskLevel }) {
  const cfg = riskConfig[level];
  return (
    <div className="glass rounded-xl p-6 flex items-center gap-6">
      <div className="relative w-24 h-24 shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
          <circle cx="18" cy="18" r="16" fill="none" stroke={cfg.ring} strokeWidth="3"
            strokeDasharray={`${score} 100`} strokeLinecap="round" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white">{score}</span>
      </div>
      <div>
        <h2 className={`text-2xl font-bold ${cfg.color}`}>{cfg.label}</h2>
        <p className="text-sm text-slate-400 mt-1">Overall risk assessment based on AI analysis</p>
      </div>
    </div>
  );
}

function RedFlagItem({ flag }: { flag: AnalysisResult["redFlags"][number] }) {
  const cfg = severityConfig[flag.severity];
  const Icon = cfg.icon;
  return (
    <div className={`glass rounded-lg p-4 ${cfg.border}`}>
      <div className="flex items-start gap-3">
        <Icon className={`${cfg.color} shrink-0 mt-0.5`} size={18} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white mb-1">{flag.clause}</p>
          <p className="text-sm text-slate-300">{flag.issue}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${cfg.color} ${cfg.bg}`}>
          {flag.severity}
        </span>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const reportRef = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const stateResult = (location.state as { result?: AnalysisResult } | null)?.result;
    if (stateResult) {
      setResult(stateResult);
      return;
    }
    const stored = localStorage.getItem("lexai_result");
    if (stored) {
      try {
        setResult(JSON.parse(stored).result);
      } catch {
        navigate("/analyze");
      }
    } else {
      navigate("/analyze");
    }
  }, [location.state, navigate]);

  const handleDownloadPdf = async () => {
    if (!reportRef.current) return;
    setDownloading(true);

    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: "#0f172a",
        scale: 2,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 20;

      while (heightLeft > 0) {
        position = -(imgHeight - heightLeft) + 10;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - 20;
      }

      pdf.save("LexAI-Contract-Analysis.pdf");
    } catch {
      // fallback
    } finally {
      setDownloading(false);
    }
  };

  if (!result) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center mb-2">
        <h1 className="text-3xl font-bold text-white">Analysis Results</h1>
        <p className="text-slate-400 mt-1">Here's what we found in your contract</p>
      </div>

      <div ref={reportRef} className="space-y-6">
        {/* Risk Score */}
        <RiskScoreCard score={result.riskScore} level={result.riskLevel} />

        {/* Red Flags */}
        {result.redFlags.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="text-red-400" size={20} />
              <h2 className="text-lg font-semibold text-white">Red Flag Clauses</h2>
            </div>
            <div className="space-y-2">
              {result.redFlags.map((flag, i) => (
                <RedFlagItem key={i} flag={flag} />
              ))}
            </div>
          </div>
        )}

        {/* Plain English */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="text-blue-400" size={20} />
            <h2 className="text-lg font-semibold text-white">Plain English Summary</h2>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{result.plainEnglishSummary}</p>
        </div>

        {/* Pidgin */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Languages className="text-emerald-400" size={20} />
            <h2 className="text-lg font-semibold text-white">Pidgin Summary</h2>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{result.pidginSummary}</p>
        </div>

        {/* Recommendations */}
        {result.recommendations.length > 0 && (
          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="text-yellow-400" size={20} />
              <h2 className="text-lg font-semibold text-white">Recommendations</h2>
            </div>
            <ul className="space-y-2">
              {result.recommendations.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <ArrowRight className="text-primary-light shrink-0 mt-0.5" size={16} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pb-8">
        <button
          onClick={handleDownloadPdf}
          disabled={downloading}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg glass text-slate-200 font-medium text-sm hover:bg-glass-hover transition-colors cursor-pointer border-none disabled:opacity-50"
        >
          <Download size={16} />
          {downloading ? "Generating PDF..." : "Download as PDF"}
        </button>
        <button
          onClick={() => navigate("/analyze")}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-medium text-sm transition-all hover:bg-primary-dark cursor-pointer border-none"
        >
          <RefreshCw size={16} />
          Analyze Another Contract
        </button>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg glass text-slate-200 font-medium text-sm hover:bg-glass-hover transition-colors cursor-pointer border-none"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
