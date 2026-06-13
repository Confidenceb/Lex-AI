export type RiskLevel = "high" | "medium" | "low";
export type ClauseRating = "good" | "medium" | "bad";

export interface RedFlag {
  clause: string;
  issue: string;
  severity: RiskLevel;
}

export interface ClauseAssessment {
  clause: string;
  explanation: string;
  rating: ClauseRating;
  found: boolean;
  detail?: string;
}

export interface AnalysisResult {
  riskScore: number;
  riskLevel: RiskLevel;
  redFlags: RedFlag[];
  clauseAssessments: ClauseAssessment[];
  plainEnglishSummary: string;
  pidginSummary: string;
  recommendations: string[];
}

export type ExtractSource = "text" | "pdf" | "docx" | "image";

export interface ProcessingStep {
  label: string;
  status: "pending" | "active" | "done" | "error";
}
