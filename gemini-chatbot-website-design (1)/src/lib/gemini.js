import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("VITE_GEMINI_API_KEY is missing from your .env file.");
}

const genAI = new GoogleGenerativeAI(API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Sends a message to the Gemini AI and returns the response.
 * @param {string} prompt - The user's input message.
 * @param {Array} history - The chat history for context.
 * @returns {Promise<string>} - The AI's response text.
 */
export async function getGeminiResponse(prompt, history = []) {
  try {
    const chat = model.startChat({
      history: history.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
      generationConfig: {
        maxOutputTokens: 2000,
      },
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (!API_KEY) {
      return "Error: Please add your VITE_GEMINI_API_KEY to the .env file.";
    }
    return "I'm sorry, I'm having trouble connecting right now. Please try again later.";
  }
}
