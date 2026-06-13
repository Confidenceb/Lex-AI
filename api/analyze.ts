import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `You are LexAI, a Nigerian contract analyst specialized in tenancy, employment, and business contracts.

Analyze the provided contract text and return a JSON object with:
- riskScore: number 0-100 (how risky this contract is for the signer)
- riskLevel: "low" | "medium" | "high"
- redFlags: array of objects with { clause: string, issue: string, severity: "low" | "medium" | "high" }
- plainEnglishSummary: a clear plain-English explanation of the contract risks
- pidginSummary: explanation in Nigerian Pidgin English
- recommendations: array of actionable recommendation strings

Return ONLY valid JSON with no markdown formatting or code blocks.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text } = req.body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({ error: "Contract text is required" });
    }

    if (text.length > 50000) {
      return res.status(400).json({ error: "Contract text too long (max 50,000 characters)" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: `Contract text:\n${text}` },
    ]);

    const response = result.response;
    let rawText = response.text();

    rawText = rawText.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();

    const parsed = JSON.parse(rawText);

    return res.status(200).json({
      riskScore: parsed.riskScore ?? parsed.risk_score ?? 50,
      riskLevel: parsed.riskLevel ?? parsed.risk_level ?? "medium",
      redFlags: parsed.redFlags ?? parsed.red_flags ?? [],
      plainEnglishSummary: parsed.plainEnglishSummary ?? parsed.plain_english ?? "",
      pidginSummary: parsed.pidginSummary ?? parsed.pidgin ?? "",
      recommendations: parsed.recommendations ?? [],
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return res.status(500).json({
      error: "Failed to analyze contract. Please try again.",
    });
  }
}
