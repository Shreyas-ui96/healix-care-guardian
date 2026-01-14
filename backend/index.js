import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

const corsOptions = {
  origin: isProduction 
    ? process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8080']
    : ['http://localhost:8080', 'http://localhost:3000', 'http://127.0.0.1:8080'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

const rateLimitMap = new Map();

function rateLimit(windowMs, maxRequests) {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, []);
    }
    
    const requests = rateLimitMap.get(ip).filter(time => time > windowStart);
    
    if (requests.length >= maxRequests) {
      return res.status(429).json({ error: 'Too many requests, please try again later' });
    }
    
    requests.push(now);
    rateLimitMap.set(ip, requests);
    next();
  };
}

const apiLimiter = rateLimit(15 * 60 * 1000, 100);
const chatLimiter = rateLimit(60 * 1000, 20);

const SYSTEM_PROMPT = `You are Healix, an AI healthcare assistant. Your role is to:
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
  chest: "Chest pain can be serious. Are you experiencing any of these symptoms: difficulty breathing, pain radiating to arm/jaw, sweating, or dizziness? If yes, please seek emergency care immediately.",
  breathing: "Difficulty breathing requires immediate attention. If you're struggling to breathe, please call emergency services (911) immediately or have someone take you to the nearest emergency room.",
  fever: "A fever can indicate various conditions. What's your current temperature? Are you experiencing any other symptoms like body aches, chills, or sore throat?",
  stomach: "Stomach issues can have many causes. Can you describe the pain - is it sharp, dull, or cramping? When did it start and have you had any changes in appetite or bowel movements?",
  default: "Thank you for sharing your symptoms with me. Could you describe them in more detail? When did they start, how severe are they on a scale of 1-10, and have you noticed any patterns or triggers?"
};

function getFallbackResponse(message) {
  const lowerMessage = (message || '').toLowerCase();
  
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

function determineUrgency(message, response) {
  const lowerMessage = (message || '').toLowerCase();
  const lowerResponse = (response || '').toLowerCase();

  if (lowerMessage.includes('chest pain') || 
      lowerMessage.includes('difficulty breathing') || 
      lowerMessage.includes("can't breathe") ||
      lowerMessage.includes('severe bleeding') ||
      lowerMessage.includes('unconscious') ||
      lowerMessage.includes('stroke') ||
      lowerResponse.includes('emergency') ||
      lowerResponse.includes('911') ||
      lowerResponse.includes('ambulance')) {
    return 'critical';
  }
  
  if (lowerMessage.includes('chest') || 
      lowerMessage.includes('breathing') ||
      lowerMessage.includes('severe pain') ||
      lowerMessage.includes('high fever') ||
      lowerResponse.includes('urgent') ||
      lowerResponse.includes('see a doctor soon') ||
      lowerResponse.includes('medical attention')) {
    return 'urgent';
  }
  
  return 'normal';
}

function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, 2000);
}

app.post('/api/chat', apiLimiter, chatLimiter, async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const sanitizedMessage = sanitizeInput(message);
    
    if (!sanitizedMessage) {
      return res.status(400).json({ error: 'Invalid message format' });
    }

    if (!genAI) {
      const fallback = getFallbackResponse(sanitizedMessage);
      return res.json({
        response: fallback.response + "\n\n(AI service is currently unavailable. Using basic response system.)",
        urgency: fallback.urgency,
        timestamp: new Date().toISOString(),
        fallback: true
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    let prompt = `${SYSTEM_PROMPT}\n\nConversation history:\n`;
    
    const recentHistory = conversationHistory.slice(-10);
    recentHistory.forEach((msg) => {
      const role = msg.role === 'user' ? 'Patient' : 'Healix';
      const content = sanitizeInput(msg.content);
      prompt += `${role}: ${content}\n`;
    });
    
    prompt += `\nPatient: ${sanitizedMessage}\nHealix:`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    const urgency = determineUrgency(sanitizedMessage, response);

    res.json({
      response: response,
      urgency: urgency,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating response:', error.message);
    
    if (error.status === 429) {
      const fallback = getFallbackResponse(req.body.message || '');
      return res.json({
        response: fallback.response + "\n\n(High demand detected. Using backup response system.)",
        urgency: fallback.urgency,
        timestamp: new Date().toISOString(),
        fallback: true
      });
    }
    
    const fallback = getFallbackResponse(req.body.message || '');
    res.json({
      response: fallback.response,
      urgency: fallback.urgency,
      timestamp: new Date().toISOString(),
      fallback: true
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Healix backend is running',
    environment: NODE_ENV,
    apiKeyConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/api/status', (req, res) => {
  res.json({
    service: 'Healix Healthcare API',
    version: '1.0.0',
    status: 'operational',
    endpoints: {
      chat: '/api/chat',
      health: '/api/health',
      status: '/api/status'
    }
  });
});

if (isProduction) {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: isProduction ? 'Something went wrong' : err.message
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Healix backend server running on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`API endpoint: http://localhost:${PORT}/api/chat`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`API Key configured: ${process.env.GEMINI_API_KEY ? 'Yes' : 'No'}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
  
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
