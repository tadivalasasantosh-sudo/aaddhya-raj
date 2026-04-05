import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateAIContent = async (prompt: string, systemInstruction: string = '') => {
  if (!apiKey) {
    throw new Error('Gemini API key is not configured.');
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || 'You are a professional content writer for AadhyaRaj Technologies, a leading tech company.',
        temperature: 0.7,
        maxOutputTokens: 2048, // Limit output to prevent token limit errors
      },
    });

    return response.text;
  } catch (error) {
    console.error('Gemini AI Error:', error);
    throw error;
  }
};
