
import { GoogleGenAI, Type } from "@google/genai";
import { Difficulty, Question } from "../types";

/**
 * Initializes the Gemini AI client lazily to ensure process.env.API_KEY 
 * is correctly accessed at runtime.
 */
const getAIClient = () => {
  const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
  if (!apiKey) {
    console.error("Gemini API Key is missing in process.env.API_KEY");
  }
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

export const generateQuiz = async (topic: string, difficulty: Difficulty, count: number): Promise<Question[]> => {
  const ai = getAIClient();
  const prompt = `Generate a high-quality quiz about "${topic}" with difficulty level "${difficulty}". 
  Generate exactly ${count} multiple-choice questions. 
  Ensure questions are accurate, challenging for the difficulty level, and educational.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: {
              type: Type.STRING,
              description: 'The text of the quiz question.',
            },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Four possible answers to the question.',
            },
            correctAnswerIndex: {
              type: Type.INTEGER,
              description: 'The zero-based index of the correct answer in the options array.',
            },
            explanation: {
              type: Type.STRING,
              description: 'A brief explanation of why the answer is correct.',
            },
          },
          required: ["question", "options", "correctAnswerIndex", "explanation"],
        },
      },
    },
  });

  try {
    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to parse quiz response:", error);
    throw new Error("The AI failed to generate a valid quiz structure. Please try again.");
  }
};
