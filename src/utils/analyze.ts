import type { AnalysisResult, RiskLevel, ClauseAssessment, ClauseRating } from "../types";

function determineRiskLevel(score: number): RiskLevel {
  if (score >= 60) return "high";
  if (score >= 30) return "medium";
  return "low";
}

// All possible contract clauses with their default ratings and explanations
const allClauses: { keyword: string; altKeyword: string; clause: string; explanation: string; rating: ClauseRating; detail: string }[] = [
  // GOOD clauses
  { keyword: "payment terms", altKeyword: "payment", clause: "Payment Terms", explanation: "Defines the payment schedule, amounts, and method of payment between parties.", rating: "good", detail: "Standard payment terms protect both parties by setting clear expectations for when and how money changes hands." },
  { keyword: "notice period", altKeyword: "notice", clause: "Notice Period", explanation: "Specifies how much advance notice either party must give before ending the agreement.", rating: "good", detail: "A fair notice period (typically 30-90 days) gives both sides time to prepare for the contract ending." },
  { keyword: "confidentiality", altKeyword: "confidential", clause: "Confidentiality", explanation: "Protects sensitive information shared between parties during the contract.", rating: "good", detail: "Standard confidentiality clauses are healthy — they ensure your private business information stays protected." },
  { keyword: "governing law", altKeyword: "governing", clause: "Governing Law", explanation: "States which country's or state's laws will govern the contract.", rating: "good", detail: "A clear governing law clause (especially Nigerian law) provides certainty about how disputes will be resolved." },
  { keyword: "dispute resolution", altKeyword: "mediation", clause: "Dispute Resolution", explanation: "Outlines the process for resolving disagreements, often through mediation or arbitration.", rating: "good", detail: "Fair dispute resolution mechanisms help avoid expensive court cases and allow for amicable settlements." },
  { keyword: "data protection", altKeyword: "privacy", clause: "Data Protection", explanation: "Governs how personal data is collected, stored, and shared.", rating: "good", detail: "A data protection clause shows the other party takes your privacy seriously and complies with regulations." },
  // MEDIUM clauses
  { keyword: "termination", altKeyword: "terminate", clause: "Termination Clause", explanation: "Sets out the conditions under which the contract can be ended early.", rating: "medium", detail: "Check that termination rights are balanced — both parties should have similar rights to exit the agreement." },
  { keyword: "renewal", altKeyword: "auto-renew", clause: "Renewal Terms", explanation: "Describes whether and how the contract renews after its initial term.", rating: "medium", detail: "Auto-renewal clauses can catch you off guard. Make sure you have adequate notice to opt out if needed." },
  { keyword: "liability cap", altKeyword: "limitation of liability", clause: "Liability Cap", explanation: "Limits the amount one party can claim from the other if something goes wrong.", rating: "medium", detail: "While liability caps are standard, ensure the cap is reasonable (e.g., tied to contract value) and not set artificially low." },
  { keyword: "assignment", altKeyword: "assign", clause: "Assignment Clause", explanation: "Controls whether either party can transfer their rights or obligations to someone else.", rating: "medium", detail: "Check if only one party can assign rights — balanced assignment clauses require mutual consent." },
  { keyword: "force majeure", altKeyword: "act of god", clause: "Force Majeure", explanation: "Excuses performance when unexpected events beyond either party's control occur.", rating: "medium", detail: "A good force majeure clause covers pandemics, natural disasters, and government actions without being overly broad." },
  { keyword: "non-solicitation", altKeyword: "no poach", clause: "Non-Solicitation", explanation: "Restricts you from hiring or soliciting the other party's employees or clients.", rating: "medium", detail: "Reasonable non-solicitation clauses are common, but overly broad restrictions can limit your business operations." },
  // BAD clauses
  { keyword: "rent review", altKeyword: "rent increase", clause: "Rent Review", explanation: "Allows the landlord to increase rent during the tenancy period.", rating: "bad", detail: "Unlimited rent review clauses can make your rent unaffordable. Look for caps tied to inflation or fixed percentages." },
  { keyword: "forfeiture", altKeyword: "forfeit", clause: "Forfeiture", explanation: "Gives the landlord the right to take back the property and keep all payments if you breach any term.", rating: "bad", detail: "Forfeiture clauses are extremely risky — you could lose both the property and all money paid, even for minor breaches." },
  { keyword: "waiver of rights", altKeyword: "waive", clause: "Waiver of Rights", explanation: "Requires you to give up important legal rights you would otherwise have under the law.", rating: "bad", detail: "Never sign away your fundamental legal rights. Many waiver clauses are unenforceable under Nigerian law anyway." },
  { keyword: "indemnity", altKeyword: "indemnif", clause: "Indemnity", explanation: "Makes you responsible for all losses, damages, or legal costs regardless of who is at fault.", rating: "bad", detail: "One-sided indemnity clauses can leave you paying for the other party's mistakes. Indemnity should be mutual and reasonable." },
  { keyword: "non-compete", altKeyword: "non compete", clause: "Non-Compete", explanation: "Restricts your ability to work in your field or start a competing business after leaving.", rating: "bad", detail: "Non-compete clauses can prevent you from earning a living. Challenge any restriction lasting more than 6 months or covering too wide an area." },
  { keyword: "binding arbitration", altKeyword: "arbitration", clause: "Binding Arbitration", explanation: "Requires disputes to be resolved by a private arbitrator instead of in court.", rating: "bad", detail: "Binding arbitration can be fair, but watch for clauses that make you pay all costs or limit what you can claim." },
  { keyword: "sole discretion", altKeyword: "sole discretion", clause: "Sole Discretion", explanation: "Gives one party the absolute right to make decisions without any obligation to be reasonable.", rating: "bad", detail: "'Sole discretion' clauses are dangerous — they hand all the power to one side. Any discretion should be exercised 'reasonably'." },
  { keyword: "garden leave", altKeyword: "garden leave", clause: "Garden Leave", explanation: "Allows the employer to extend your notice period and keep you away from work while still employed.", rating: "bad", detail: "Unlimited garden leave can trap you in limbo — unable to work for your employer or start a new job." },
];

function generateMockResult(text: string): AnalysisResult {
  const lower = text.toLowerCase();
  let score = 15;
  const redFlags: AnalysisResult["redFlags"] = [];
  const clauseAssessments: ClauseAssessment[] = [];

  for (const item of allClauses) {
    const found = lower.includes(item.keyword) || lower.includes(item.altKeyword);
    clauseAssessments.push({
      clause: item.clause,
      explanation: item.explanation,
      rating: item.rating,
      found,
      detail: item.detail,
    });

    if (found && item.rating === "bad") {
      const points = item.clause === "Forfeiture" || item.clause === "Waiver of Rights" ? 25
        : item.clause === "Rent Review" || item.clause === "Non-Compete" || item.clause === "Indemnity" ? 20
        : item.clause === "Sole Discretion" ? 20
        : 15;
      score += points;
      redFlags.push({
        clause: item.clause,
        issue: item.detail,
        severity: points >= 25 ? "high" : points >= 20 ? "medium" : "low",
      });
    }
  }

  // If nothing bad matched, add a generic note
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
    clauseAssessments,
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
      ...(clauseAssessments.some(c => c.clause.includes("Non-Compete") && c.found) ? ["Limit non-compete scope to a reasonable time (max 6 months) and geographic area"] : []),
      ...(clauseAssessments.some(c => c.clause.includes("Rent") && c.found) ? ["Cap rent increases at a fixed percentage or link them to inflation"] : []),
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
      clauseAssessments: data.clauseAssessments ?? data.clause_assessments ?? [],
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
