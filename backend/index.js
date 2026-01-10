import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `You are Helix, an AI healthcare assistant. Your role is to:
1. Listen to patients' symptoms with empathy and care
2. Ask relevant follow-up questions to better understand their condition
3. Assess urgency levels (normal, urgent, critical)
4. Provide helpful health information and guidance
5. Recommend when to seek immediate medical attention
6. Never diagnose, but help triage and provide general health information

Important guidelines:
- For chest pain, severe breathing difficulty, or other critical symptoms, always recommend immediate emergency care
- Be empathetic, professional, and clear in your responses
- Ask one or two questions at a time
- Provide actionable next steps

Keep responses concise but informative, around 2-4 sentences.`;


const fallbackResponses = {
  headache: "I understand you're experiencing a headache. Can you tell me more about it? How long have you had it, and is it accompanied by any other symptoms like nausea, sensitivity to light, or fever?",
  chest: " Chest pain can be serious. Are you experiencing any of these symptoms: difficulty breathing, pain radiating to arm/jaw, sweating, or dizziness? If yes, please seek emergency care immediately.",
  breathing: " Difficulty breathing requires immediate attention. If you're struggling to breathe, please call emergency services (911) immediately or have someone take you to the nearest emergency room.",
  fever: "A fever can indicate various conditions. What's your current temperature? Are you experiencing any other symptoms like body aches, chills, or sore throat?",
  stomach: "Stomach issues can have many causes. Can you describe the pain - is it sharp, dull, or cramping? When did it start and have you had any changes in appetite or bowel movements?",
  default: "Thank you for sharing your symptoms with me. Could you describe them in more detail? When did they start, how severe are they on a scale of 1-10, and have you noticed any patterns or triggers?"
};

function getFallbackResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('headache') || lowerMessage.includes('head')) {
    return { response: fallbackResponses.headache, urgency: 'normal' };
  }
  if (lowerMessage.includes('chest')) {
    return { response: fallbackResponses.chest, urgency: 'urgent' };
  }
  if (lowerMessage.includes('breath') || lowerMessage.includes('breathing')) {
    return { response: fallbackResponses.breathing, urgency: 'critical' };
  }
  if (lowerMessage.includes('fever') || lowerMessage.includes('temperature')) {
    return { response: fallbackResponses.fever, urgency: 'normal' };
  }
  if (lowerMessage.includes('stomach') || lowerMessage.includes('belly') || lowerMessage.includes('abdomen')) {
    return { response: fallbackResponses.stomach, urgency: 'normal' };
  }
  
  return { response: fallbackResponses.default, urgency: 'normal' };
}

app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Use gemini-2.0-flash (the currently available model)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });


    let prompt = `${SYSTEM_PROMPT}\n\nConversation history:\n`;
    
   
    conversationHistory.forEach((msg) => {
      prompt += `${msg.role === 'user' ? 'Patient' : 'Helix'}: ${msg.content}\n`;
    });
    
    prompt += `\nPatient: ${message}\nHelix:`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();


    let urgency = 'normal';
    const lowerMessage = message.toLowerCase();
    const lowerResponse = response.toLowerCase();

    if (lowerMessage.includes('chest pain') || 
        lowerMessage.includes('difficulty breathing') || 
        lowerMessage.includes('can\'t breathe') ||
        lowerMessage.includes('severe bleeding') ||
        lowerResponse.includes('emergency') ||
        lowerResponse.includes('911') ||
        lowerResponse.includes('ambulance')) {
      urgency = 'critical';
    } else if (lowerMessage.includes('chest') || 
               lowerMessage.includes('breathing') ||
               lowerMessage.includes('severe pain') ||
               lowerResponse.includes('urgent') ||
               lowerResponse.includes('see a doctor soon')) {
      urgency = 'urgent';
    }

    res.json({
      response: response,
      urgency: urgency,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating response:', error.message);
    
    // Handle rate limiting (429 errors) - use fallback responses
    if (error.status === 429) {
      console.log('Rate limit exceeded, using fallback response');
      const fallback = getFallbackResponse(req.body.message);
      return res.json({
        response: fallback.response + "\n\n_(Note: I'm currently experiencing high demand. For complex questions, please try again in a moment.)_",
        urgency: fallback.urgency,
        timestamp: new Date().toISOString(),
        fallback: true
      });
    }
    
    // For other errors, also use fallback
    const fallback = getFallbackResponse(req.body.message);
    res.json({
      response: fallback.response,
      urgency: fallback.urgency,
      timestamp: new Date().toISOString(),
      fallback: true
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Helix backend is running', apiKeyConfigured: !!process.env.GEMINI_API_KEY });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Helix backend server running on port ${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api/chat`);
  console.log(`API Key configured: ${process.env.GEMINI_API_KEY ? 'Yes' : 'No'}`);
});

// Keep the server running
server.on('error', (err) => {
  console.error('Server error:', err);
});

process.on('SIGTERM', () => {
  console.log('Shutting down server...');
  server.close(() => process.exit(0));
});
