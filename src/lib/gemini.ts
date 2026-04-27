import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';
const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
export const genAI = new GoogleGenerativeAI(apiKey);

export const model = genAI.getGenerativeModel({ model: geminiModel });

export async function askGemini(prompt: string): Promise<string> {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    if (message.includes('429') || message.includes('quota')) {
      console.warn('Gemini quota exceeded, using fallback');
      throw new Error('AI_QUOTA_EXCEEDED');
    }
    throw error;
  }
}

export const getGeminiModel = (modelName = geminiModel) => {
  return genAI.getGenerativeModel({ model: modelName });
};
