import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeContract } from "../utils/analyze";
import { extractFromFile, isSupportedFile } from "../utils/extractors";
import { Upload, FileText, X, Loader2, FileWarning } from "lucide-react";

export default function AnalysisPage() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [inputMode, setInputMode] = useState<"paste" | "upload">("paste");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canAnalyze = inputMode === "paste" ? text.trim().length > 0 : file !== null;

  const handleAnalyze = useCallback(async () => {
    setError(null);
    setProcessing(true);

    try {
      let contractText = "";

      if (inputMode === "paste") {
        contractText = text.trim();
        if (!contractText) {
          setError("Please paste some contract text first.");
          setProcessing(false);
          return;
        }
      } else if (file) {
        if (!isSupportedFile(file)) {
          setError("Unsupported file type. Please upload a PDF, DOCX, or image file.");
          setProcessing(false);
          return;
        }
        const extracted = await extractFromFile(file);
        contractText = extracted.text;
        if (!contractText) {
          setError("Could not extract any text from the file. Try pasting the text directly.");
          setProcessing(false);
          return;
        }
      }

      const result = await analyzeContract(contractText);

      localStorage.setItem("lexai_result", JSON.stringify({ result }));
      navigate("/results", { state: { result } });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setProcessing(false);
    }
  }, [inputMode, text, file, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (isSupportedFile(selected)) {
        setFile(selected);
        setError(null);
      } else {
        setError("Unsupported file type. Please upload a PDF, DOCX, or image file.");
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">
          Analyze Your Contract
        </h1>
        <p className="text-slate-400 text-lg">
          Paste your contract text or upload a file to get started
        </p>
      </div>

      <div className="glass rounded-xl p-6 space-y-6">
        {/* Input mode tabs */}
        <div className="flex gap-1 p-1 bg-white/5 rounded-lg w-fit">
          <button
            onClick={() => setInputMode("paste")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors cursor-pointer border-none ${
              inputMode === "paste"
                ? "bg-primary text-white"
                : "text-slate-400 hover:text-white bg-transparent"
            }`}
          >
            <FileText size={16} />
            Paste Text
          </button>
          <button
            onClick={() => setInputMode("upload")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors cursor-pointer border-none ${
              inputMode === "upload"
                ? "bg-primary text-white"
                : "text-slate-400 hover:text-white bg-transparent"
            }`}
          >
            <Upload size={16} />
            Upload File
          </button>
        </div>

        {/* Text input */}
        {inputMode === "paste" && (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your contract text here..."
            className="w-full h-72 p-4 rounded-lg bg-slate-800/50 border border-white/10 text-slate-200 text-sm resize-y focus:outline-none focus:border-primary-light transition-colors placeholder:text-slate-500"
          />
        )}

        {/* File upload */}
        {inputMode === "upload" && (
          <div className="space-y-4">
            {!file ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/10 rounded-lg p-10 text-center hover:border-white/20 transition-colors cursor-pointer"
              >
                <Upload className="mx-auto mb-3 text-slate-400" size={36} />
                <p className="text-sm text-slate-400 mb-1">
                  Drop a file here or click to browse
                </p>
                <p className="text-xs text-slate-500">
                  PDF, DOCX, PNG, JPG supported
                </p>
              </div>
            ) : (
              <div className="glass rounded-lg p-4 flex items-center gap-3">
                <FileText className="text-primary-light shrink-0" size={20} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{file.name}</p>
                  <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-slate-500 hover:text-white transition-colors bg-transparent border-none cursor-pointer shrink-0"
                >
                  <X size={18} />
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 glass rounded-lg p-4 border border-red-500/30">
            <FileWarning className="text-red-400 shrink-0 mt-0.5" size={20} />
            <div className="flex-1 min-w-0">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-slate-500 hover:text-white transition-colors bg-transparent border-none cursor-pointer shrink-0"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Analyze button */}
        <button
          onClick={handleAnalyze}
          disabled={!canAnalyze || processing}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-primary text-white font-medium text-base transition-all hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-none"
        >
          {processing ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            "Analyze Contract"
          )}
        </button>
      </div>

      {/* Processing overlay */}
      {processing && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass rounded-xl p-8 max-w-sm w-full mx-4 text-center">
            <Loader2 className="animate-spin text-primary-light mx-auto mb-4" size={32} />
            <p className="text-white text-sm">Analyzing your contract...</p>
            <p className="text-slate-400 text-xs mt-1">This usually takes a few seconds</p>
          </div>
        </div>
      )}
    </div>
  );
}
