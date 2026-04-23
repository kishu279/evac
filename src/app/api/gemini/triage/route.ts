import { NextResponse } from 'next/server';
import { askGemini } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const { userInput, userRole } = await request.json();
    
    const prompt = `Emergency triage AI. Staff reported: '${userInput}'. Staff role: ${userRole}.
Respond with ONLY a raw JSON object (no markdown, no backticks):
{ "severity": "low"|"medium"|"high"|"critical", "classification": "string", "immediateActions": ["string", "string"], "escalateToRoles": ["string"], "summary": "string" }`;

    const responseText = await askGemini(prompt);
    
    let triageResult;
    try {
      const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      triageResult = JSON.parse(cleanedJson);
    } catch (parseError) {
      console.error("Failed to parse Triage response", parseError);
      throw new Error("Failed to parse triage response");
    }

    return NextResponse.json({ triage: triageResult });
  } catch (error: any) {
    console.error("Triage API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
