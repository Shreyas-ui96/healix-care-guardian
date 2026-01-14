# Synkcare AI Chat Setup Guide

##  Quick Start

Your Synkcare AI chat system is now integrated with Google's Gemini API!

### Prerequisites
- Node.js installed
- Gemini API key (already configured)

### Running the Application

You need to run **two servers** simultaneously:

#### Terminal 1 - Backend Server (Port 3001)
```bash
npm run backend
```

#### Terminal 2 - Frontend Server (Port 8080)
```bash
npm run dev
```

### Access the Application
Once both servers are running, open your browser and navigate to:
```
http://localhost:8080
```

##  Configuration

### Environment Variables
The `.env` file contains your Gemini API key:
```
GEMINI_API_KEY=your_api_key_here
PORT=3001
```

### API Endpoints

**Backend Server (localhost:3001)**
- `POST /api/chat` - Send messages to the AI
- `GET /api/health` - Check server status

**Frontend Server (localhost:8080)**
- Proxies `/api/*` requests to the backend automatically

##  Features

The AI healthcare assistant:
- Listens to patient symptoms with empathy
- Asks relevant follow-up questions
- Assesses urgency levels (normal, urgent, critical)
- Provides health information and guidance
- Recommends when to seek immediate medical attention
- Uses conversation history for context-aware responses

##  Urgency Detection

The system automatically detects urgency based on keywords:

- **Critical**: chest pain, difficulty breathing, severe bleeding
- **Urgent**: breathing issues, severe pain, chest discomfort
- **Normal**: general health queries and symptoms

##  How It Works

1. User sends a message through the chat interface
2. Frontend sends the message + conversation history to `/api/chat`
3. Backend processes the message using Gemini AI
4. Response is sent back with urgency level
5. Frontend displays the response and updates urgency badge

##  Troubleshooting

**Backend not connecting?**
- Check if the backend is running on port 3001
- Verify the `.env` file has a valid `GEMINI_API_KEY`

**Frontend not loading?**
- Ensure the frontend is running on port 8080
- Check browser console for errors

**API errors?**
- Verify your Gemini API key is valid
- Check the backend terminal for error messages
