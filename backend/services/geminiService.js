const { GoogleGenAI } = require("@google/genai");
const config = require("../config");

const ai = new GoogleGenAI({
  apiKey: config.gemini.apiKey,
});

async function performReview(code, staticAnalysis, metrics) {
  const prompt = `
You are an expert JavaScript code reviewer.

Review the following code.

Return ONLY valid JSON.

{
  "overallScore": 90,
  "summary": "",
  "bugs": [],
  "codeSmells": [],
  "securityRecommendations": [],
  "performanceImprovements": [],
  "bestPractices": []
}

Code:
${code}

Static Analysis:
${JSON.stringify(staticAnalysis, null, 2)}

Metrics:
${JSON.stringify(metrics, null, 2)}
`;

  try {
    console.log("========== GEMINI ==========");
    console.log("Sending request to Gemini...");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = response.text;

    console.log("Raw Gemini Response:");
    console.log(text);

    // Remove markdown code fences if Gemini wraps JSON
    text = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // Extract JSON object
    const match = text.match(/\{[\s\S]*\}/);

    if (!match) {
      throw new Error("Gemini did not return valid JSON.");
    }

    const json = JSON.parse(match[0]);

    console.log("JSON parsed successfully.");

    return {
      overallScore: json.overallScore ?? 0,
      summary: json.summary ?? "",
      bugs: json.bugs ?? [],
      codeSmells: json.codeSmells ?? [],
      securityRecommendations: json.securityRecommendations ?? [],
      performanceImprovements: json.performanceImprovements ?? [],
      bestPractices: json.bestPractices ?? [],
    };
  } catch (err) {
    console.error("========== GEMINI ERROR ==========");
    console.error(err);
    throw err;
  }
}

module.exports = {
  performReview,
};