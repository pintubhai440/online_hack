import { GoogleGenerativeAI } from "@google/generative-ai";

// Vercel Vault se ATM Pin (API Key) nikal rahe hain
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Engine start kar rahe hain
const genAI = new GoogleGenerativeAI(apiKey);

// Ye function backend mein kaam karega real data laane ke liye
export async function getUniversityData(promptText: string) {
  try {
    // Hum fast aur smart model use kar rahe hain
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    
    const result = await model.generateContent(promptText);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Error:", error);
    return "Error fetching data.";
  }
}
