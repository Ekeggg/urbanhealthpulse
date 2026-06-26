import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function safeParseJSON(text: string) {
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}

async function generate(systemPrompt: string, userPrompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: systemPrompt,
  });
  const result = await model.generateContent(userPrompt);
  return result.response.text();
}

export async function analyzePersonal(logs: any[]) {
  const formatted = logs
    .map(l => {
      const date = new Date(l.date).toDateString();
      const symptoms = Array.isArray(l.symptoms) ? l.symptoms.join(', ') : l.symptoms;
      return `${date}: ${symptoms} (severity ${l.severity}/10)${l.notes ? ' — ' + l.notes : ''}`;
    })
    .join('\n');

  const text = await generate(
    `You are a health pattern assistant for an urban health tracking app.
Analyze the user's symptom logs and identify patterns, trends, and anything worth flagging.
Be concise, supportive, and specific to the data. Never diagnose. Always recommend consulting
a doctor for anything concerning.
Respond ONLY with valid JSON — no markdown, no preamble:
{ "summary": string, "patterns": string[], "flags": string[], "advice": string }`,
    `My symptom logs:\n\n${formatted}`
  );

  return safeParseJSON(text);
}

export async function analyzeCity(districtSummaries: any[]) {
  const formatted = districtSummaries
    .map(
      d =>
        `${d.district}: ${d.topSymptoms.join(', ')} — avg severity ${d.avgSeverity}/10 — ${d.count} reports`
    )
    .join('\n');

  const text = await generate(
    `You are a public health AI for a smart city dashboard.
Analyze anonymized, self-reported symptom data aggregated by district.
Identify clusters, spikes, and cross-district patterns. Be measured, not alarmist.
Respond ONLY with valid JSON — no markdown, no preamble:
{
  "alert_level": "low" | "medium" | "high",
  "summary": string,
  "hotspots": [{ "district": string, "reason": string }],
  "trends": string[],
  "recommendations": string[]
}`,
    `City-wide symptom report by district:\n\n${formatted}`
  );

  return safeParseJSON(text);
}
