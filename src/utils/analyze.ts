import type { AnalysisResult, RiskLevel } from "../types";

function determineRiskLevel(score: number): RiskLevel {
  if (score >= 60) return "high";
  if (score >= 30) return "medium";
  return "low";
}

function generateMockResult(text: string): AnalysisResult {
  const lower = text.toLowerCase();
  let score = 15;
  const redFlags: AnalysisResult["redFlags"] = [];

  const checks: [string, string, string, string, number][] = [
    ["rent review", "rent increase", "Rent Review clause", "Landlord can increase rent at any time without limit", 20],
    ["forfeiture", "forfeit", "Forfeiture clause", "You can lose the property and all advance payments without legal process", 25],
    ["waiver of rights", "waive", "Waiver of Rights", "You are giving up your legal rights under Nigerian law", 30],
    ["indemnity", "indemnif", "Indemnity clause", "You are liable for all damages regardless of fault", 20],
    ["non-compete", "non compete", "Non-Compete clause", "Restricts your ability to work in your field for years after leaving", 20],
    ["intellectual property", "intellectual property", "IP Assignment clause", "Your personal inventions outside work hours become company property", 15],
    ["24 hours", "24 hour", "Termination clause", "Employer can terminate with only 24 hours notice but you must give months", 25],
    ["6 day", "six day", "Working Hours", "Mandatory Saturday work without overtime compensation", 15],
    ["no notice", "without notice", "Termination without Notice", "Contract can be terminated without any notice period", 30],
    ["garden leave", "garden leave", "Garden Leave clause", "Employer can extend your notice period indefinitely", 15],
    ["probation", "probation", "Probation Period", "You can be dismissed during probation without reason or notice", 15],
    ["no carry forward", "cannot be carried", "Leave Policy", "Annual leave expires if not used within the year", 10],
  ];

  for (const [keyword1, keyword2, clause, issue, points] of checks) {
    if (lower.includes(keyword1) || lower.includes(keyword2)) {
      score += points;
      redFlags.push({
        clause,
        issue,
        severity: points >= 25 ? "high" : points >= 15 ? "medium" : "low",
      });
    }
  }

  // Additional keywords that don't match a specific clause
  const riskyKeywords: [string, string, string, number][] = [
    ["sole discretion", "Sole Discretion", "Decisions are entirely at the other party's discretion with no recourse", 20],
    ["non-refundable", "Non-Refundable Deposit", "You lose this money regardless of circumstances", 15],
    ["binding arbitration", "Binding Arbitration", "You give up your right to take disputes to court", 10],
    ["as is", "As-Is clause", "The property is accepted with no guarantees about its condition", 10],
  ];

  for (const [keyword, clause, issue, points] of riskyKeywords) {
    if (lower.includes(keyword)) {
      score += points;
      redFlags.push({
        clause,
        issue,
        severity: points >= 20 ? "high" : points >= 15 ? "medium" : "low",
      });
    }
  }

  // If nothing matched, add a generic note
  if (redFlags.length === 0) {
    redFlags.push({
      clause: "General Review Needed",
      issue: "No specific red flags detected automatically. A thorough review by a legal professional is still recommended.",
      severity: "low",
    });
  }

  score = Math.min(score, 100);

  return {
    riskScore: score,
    riskLevel: determineRiskLevel(score),
    redFlags,
    plainEnglishSummary: score >= 50
      ? `This contract contains several high-risk clauses that could significantly disadvantage you. Key concerns include clauses that give the other party unchecked power, limit your legal rights, or impose unfair obligations. We strongly recommend negotiating changes before signing.`
      : score >= 25
        ? `This contract has some moderate-risk areas you should be aware of. While not all clauses are unfavorable, there are several provisions that could create problems down the line. Consider negotiating the highlighted clauses for better terms.`
        : `This contract appears relatively balanced with few major red flags. However, always have a legal professional review any contract before signing, as risks may not be immediately obvious from the language used.`,
    pidginSummary: score >= 50
      ? `Oga/Madam, dis contract get plenty wahala o! Dey many clauses wey fit put you for trouble. Some parts give di other person full power over you, and some dey take away your rights. Make you no sign until you change all di bad parts. Abeg, find lawyer to help you look am well-well.`
      : score >= 25
        ? `Dis contract get some small-small tings wey you need to take note of. No be say everything bad, but some clauses fit give you problem for future. Better make you talk to di person wey write am to change di tings wey no good for you.`
        : `Dis contract look okay so far. But make you still show am to lawyer before you sign, because some wahala fit hide inside small small words wey you no go notice.`,
    recommendations: [
      ...(score >= 30 ? ["Negotiate or remove any clauses that give the other party sole discretion over important decisions"] : []),
      ...(score >= 20 ? ["Ensure notice periods are fair and balanced for both parties"] : []),
      ...(score >= 15 ? ["Do not sign away your legal right to take disputes to court"] : []),
      ...(redFlags.some(f => f.clause.includes("Non-Compete")) ? ["Limit non-compete scope to a reasonable time (max 6 months) and geographic area"] : []),
      ...(redFlags.some(f => f.clause.includes("Rent")) ? ["Cap rent increases at a fixed percentage or link them to inflation"] : []),
      ...(redFlags.some(f => f.severity === "high") ? ["Consult a Nigerian lawyer before signing this contract"] : []),
      "Keep a signed copy of the final version of this contract in a safe place",
      "Document all communications and promises made outside this contract",
    ],
  };
}

export async function analyzeContract(
  text: string,
  useMockFallback = true,
): Promise<AnalysisResult> {
  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      throw new Error(`API error (${res.status})`);
    }

    const data = await res.json();

    return {
      riskScore: data.riskScore ?? data.risk_score ?? 50,
      riskLevel: data.riskLevel ?? data.risk_level ?? "medium",
      redFlags: data.redFlags ?? data.red_flags ?? [],
      plainEnglishSummary: data.plainEnglishSummary ?? data.plain_english ?? "",
      pidginSummary: data.pidginSummary ?? data.pidgin ?? "",
      recommendations: data.recommendations ?? [],
    };
  } catch (err) {
    if (useMockFallback) {
      console.warn("API unavailable, using mock analysis:", err);
      return generateMockResult(text);
    }
    throw err;
  }
}
