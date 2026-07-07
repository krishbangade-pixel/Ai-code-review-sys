
const OpenAI = require('openai');
const config = require('../config');

const openai = new OpenAI({
  apiKey: config.openai.apiKey,
  timeout: 120000 // 2 minutes timeout
});

const openAiService = {
  async performReview(code, staticAnalysis, metrics) {
    console.log('[openAiService] Starting AI code review...');
    const prompt = `You are an expert senior software engineer. Perform a comprehensive code review for the following code, including the static analysis results and code metrics.

Code:
${code}

Static Analysis Results:
${JSON.stringify(staticAnalysis, null, 2)}

Code Metrics:
${JSON.stringify(metrics, null, 2)}

Return your review as a JSON object with the following structure:
{
  "overallScore": number between 0-100,
  "summary": "A brief summary of the review",
  "bugs": [
    {
      "description": "Bug description",
      "severity": "Critical|High|Medium|Low",
      "lineNumber": number or null,
      "suggestedFix": "How to fix it"
    }
  ],
  "codeSmells": [
    {
      "description": "Code smell description",
      "severity": "Critical|High|Medium|Low",
      "lineNumber": number or null
    }
  ],
  "performanceImprovements": [
    {
      "description": "Performance improvement description",
      "severity": "Critical|High|Medium|Low",
      "suggestion": "Suggestion for improvement"
    }
  ],
  "securityRecommendations": [
    {
      "description": "Security recommendation",
      "severity": "Critical|High|Medium|Low",
      "suggestion": "Suggestion"
    }
  ],
  "bestPractices": [
    {
      "description": "Best practice not followed",
      "severity": "Critical|High|Medium|Low",
      "suggestion": "How to follow best practice"
    }
  ],
  "namingSuggestions": [
    {
      "currentName": "Current variable/function name",
      "suggestedName": "Suggested better name",
      "reason": "Why the name should be changed"
    }
  ],
  "refactoringSuggestions": [
    {
      "description": "What to refactor",
      "suggestion": "How to refactor",
      "severity": "Critical|High|Medium|Low"
    }
  ],
  "documentationSuggestions": [
    {
      "location": "Where documentation is needed",
      "suggestion": "What documentation to add"
    }
  ],
  "suggestedFixes": [
    {
      "description": "Fix description",
      "codeBefore": "Original code snippet",
      "codeAfter": "Fixed code snippet",
      "severity": "Critical|High|Medium|Low"
    }
  ]
}

Only return valid JSON without any markdown or extra text.`;

    try {
      console.log('[openAiService] Calling OpenAI API...');
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a code review assistant that responds only with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3
      });

      const content = response.choices[0].message.content;
      console.log('[openAiService] OpenAI response received');
      
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log('[openAiService] AI response parsed successfully:', parsed);
        return parsed;
      } else {
        throw new Error('Could not parse AI response: no valid JSON found');
      }
    } catch (error) {
      console.error('[openAiService] OpenAI API error:', error);
      throw new Error(`OpenAI API failed: ${error.message}`);
    }
  }
};

module.exports = openAiService;
