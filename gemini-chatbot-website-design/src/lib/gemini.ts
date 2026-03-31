import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("VITE_GEMINI_API_KEY is not set. Please add it to your .env file.");
}

const genAI = new GoogleGenerativeAI(API_KEY || "AIzaSyBUl98rjJDio3B6sWcrRghm2He0PAGxhJ8");

export const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  },
});

export async function sendMessage(history: { role: "user" | "model"; parts: { text: string }[] }[], text: string) {
  const chat = model.startChat({
    history: history,
  });

  const result = await chat.sendMessage(text);
  const response = await result.response;
  return response.text();
}
