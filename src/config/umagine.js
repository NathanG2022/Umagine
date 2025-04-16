
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyAdL9dmhOlHeo3m9d_MMF8QJEAZMywGpfE"; // Removed extra "const" at the end
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 65536,
  responseModalities: [],
  responseMimeType: "text/plain",
};

async function run(prompt) {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage(prompt);
  
  // For browser environment, we'll return the text instead of writing to files
  console.log(result.response.text());
  return result.response.text();
  
  // File operations are removed as they're not possible in browser context
}

export default run;