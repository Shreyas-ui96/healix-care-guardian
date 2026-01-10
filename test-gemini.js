
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

console.log("Testing Gemini API Connection...\n");


const apiKey = process.env.GEMINI_API_KEY;
console.log("API Key loaded:", apiKey ? `Yes (${apiKey.substring(0, 10)}...)` : "NO - API key not found!");

if (!apiKey) {
  console.log("\n ERROR: GEMINI_API_KEY not found in .env file");
  console.log("Make sure your .env file contains: GEMINI_API_KEY=your_api_key_here");
  process.exit(1);
}

async function testGemini() {
  try {
    console.log("\n Initializing Gemini AI...");
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try different model names
    const modelNames = ["gemini-2.0-flash-lite", "gemini-2.0-flash-exp", "gemini-2.0-flash", "gemini-1.5-pro", "gemini-exp-1206"];
    
    for (const modelName of modelNames) {
      try {
        console.log(`\n Trying model: ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        console.log(" Sending test message...");
        const result = await model.generateContent("Say hello in one sentence.");
        
        console.log("Getting response...");
        const response = result.response.text();
        
        console.log(`\n SUCCESS! Model "${modelName}" is working!`);
        console.log(" Response:", response);
        return modelName; // Return the working model name
        
      } catch (modelError) {
        console.log(` Model "${modelName}" failed:`);
        console.log(`   Status: ${modelError.status || 'N/A'}`);
        console.log(`   Message: ${modelError.message}`);
      }
    }
    
    console.log("\n None of the models worked. Please check your API key.");
    
  } catch (error) {
    console.log("\n ERROR connecting to Gemini API:");
    console.log("Error Message:", error.message);
    console.log("\nFull error:", error);
  }
}

testGemini();
