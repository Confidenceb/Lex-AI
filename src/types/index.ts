export type RiskLevel = "high" | "medium" | "low";

export interface RedFlag {
  clause: string;
  issue: string;
  severity: RiskLevel;
}

export interface AnalysisResult {
  riskScore: number;
  riskLevel: RiskLevel;
  redFlags: RedFlag[];
  plainEnglishSummary: string;
  pidginSummary: string;
  recommendations: string[];
}

export type ExtractSource = "text" | "pdf" | "docx" | "image";

export interface ProcessingStep {
  label: string;
  status: "pending" | "active" | "done" | "error";
}
