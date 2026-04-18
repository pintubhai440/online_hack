import { GoogleGenerativeAI } from "@google/generative-ai";

// Vercel Vault se saari API Keys nikal rahe hain (comma separated)
const apiKeysString = import.meta.env.VITE_GEMINI_API_KEY || "";
// Keys ko split karke array bana rahe hain taaki extra space hat jaye
const apiKeys = apiKeysString.split(',').map(key => key.trim()).filter(key => key.length > 0);

// Shuruat pehli key (index 0) se hogi
let currentKeyIndex = 0;

export async function getUniversityData(promptText: string) {
  if (apiKeys.length === 0) {
    console.error("Koi API key nahi mili Vercel environment mein.");
    return "Error fetching data.";
  }

  let attempts = 0;
  const maxAttempts = apiKeys.length;

  // Jab tak saari keys try nahi ho jati, tab tak loop chalega
  while (attempts < maxAttempts) {
    try {
      // Current active key se engine start kar rahe hain
      const currentApiKey = apiKeys[currentKeyIndex];
      const genAI = new GoogleGenerativeAI(currentApiKey);
      
      // Hum fast aur smart model use kar rahe hain
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
      
      const result = await model.generateContent(promptText);
      const response = await result.response;
      
      // Agar result mil gaya, toh data bhej do aur function rok do
      return response.text();

    } catch (error) {
      console.warn(`API Key ${currentKeyIndex + 1} fail ho gayi (Limit ya error). Shifting to next...`);
      
      // Agar fail hua, toh index ko next key par shift karo (Round Robin)
      currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
      attempts++;

      // Agar saari keys fail ho gayi loop ke andar
      if (attempts >= maxAttempts) {
        console.error("Saari API keys try kar li par sab limit par hain ya fail ho gayi!");
        return "Error fetching data.";
      }
    }
  }
}
