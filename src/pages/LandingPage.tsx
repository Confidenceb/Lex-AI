import { useNavigate } from "react-router-dom";
import { Scale, ShieldAlert, BookOpen, Languages, Lightbulb, ArrowRight, FileText, Upload, Zap, CheckCircle } from "lucide-react";

const features = [
  { icon: ShieldAlert, title: "Risk Detection", desc: "Identify unfair clauses and hidden risks before you sign" },
  { icon: BookOpen, title: "Plain English", desc: "Complex legal terms explained in simple language anyone can understand" },
  { icon: Languages, title: "Pidgin Support", desc: "Understanding your rights in the language you speak every day" },
  { icon: Lightbulb, title: "Recommendations", desc: "Actionable steps to negotiate better terms and protect yourself" },
];

const steps = [
  { icon: FileText, title: "Paste or Upload", desc: "Copy-paste your contract or upload a PDF, DOCX, or image" },
  { icon: Zap, title: "AI Analysis", desc: "Our AI scans for red flags in Nigerian tenancy, employment & business contracts" },
  { icon: CheckCircle, title: "Get Results", desc: "Receive risk score, explanations, and recommendations in seconds" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 pt-20 pb-24 text-center relative">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm text-slate-300 mb-8">
            <Zap size={14} className="text-primary-light" />
            AI-Powered Contract Analysis for Nigerians
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-4 sm:mb-6">
            Know What You&apos;re
            <span className="text-primary-light"> Signing</span>
          </h1>
          <p className="text-sm sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-8 sm:mb-10">
            Many Nigerians sign tenancy agreements, employment contracts, and business contracts
            without understanding the risks. LexAI helps you spot red flags before they cost you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/analyze")}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-white font-medium text-lg hover:bg-primary-dark transition-colors cursor-pointer border-none"
            >
              Analyze Your Contract
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => navigate("/analyze")}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl glass text-slate-200 font-medium text-lg hover:bg-glass-hover transition-colors cursor-pointer border-none"
            >
              <Upload size={20} />
              Upload Contract
            </button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle size={14} className="text-emerald-400" /> No signup
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle size={14} className="text-emerald-400" /> Free
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle size={14} className="text-emerald-400" /> Confidential
            </span>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:py-20">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
              The Problem
            </h2>
            <p className="text-sm sm:text-lg text-slate-400 max-w-2xl mx-auto">
              Millions of Nigerians sign contracts every day without understanding the fine print
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Tenancy", desc: "Unfair rent review clauses, forfeiture terms, and waivers of legal rights buried in fine print" },
              { title: "Employment", desc: "One-sided termination clauses, excessive non-compete agreements, and unpaid overtime" },
              { title: "Business", desc: "Indemnity traps, binding arbitration clauses, and intellectual property giveaways" },
            ].map((item) => (
              <div key={item.title} className="glass rounded-xl p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                  <ShieldAlert className="text-red-400" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:py-20">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
              What LexAI Does
            </h2>
            <p className="text-sm sm:text-lg text-slate-400">
              Four key insights for every contract you upload
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="glass rounded-xl p-6 flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="text-primary-light" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{f.title}</h3>
                    <p className="text-sm text-slate-400">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:py-20">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
              How It Works
            </h2>
            <p className="text-sm sm:text-lg text-slate-400">
              Three simple steps to understand your contract
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="text-center">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 relative">
                    <Icon className="text-primary-light" size={28} />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-400">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:py-20 text-center">
          <div className="glass rounded-2xl p-6 sm:p-12 md:p-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Understand Your Contract?
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
              Upload or paste your contract. Get a clear risk analysis in seconds. No signup needed.
            </p>
            <button
              onClick={() => navigate("/analyze")}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-white font-medium text-lg hover:bg-primary-dark transition-colors cursor-pointer border-none"
            >
              <Scale size={20} />
              Start Analysis
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
