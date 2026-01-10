import { useState, useRef, useEffect } from "react";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import UrgencyBadge from "./UrgencyBadge";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

interface ChatInterfaceProps {
  onBack: () => void;
}

const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hello! I'm Healix, your AI healthcare assistant. I'm here to help assess your symptoms and connect you with the right care. How are you feeling today?",
    role: "assistant",
    timestamp: "Just now",
  },
];

const symptomResponses: Record<string, { response: string; urgency: "normal" | "urgent" | "critical" }> = {
  headache: {
    response: "I understand you're experiencing a headache. Let me ask a few questions: How long have you had this headache? Is it accompanied by any other symptoms like nausea, sensitivity to light, or fever?",
    urgency: "normal",
  },
  chest: {
    response: "⚠️ Chest pain can be serious. Are you experiencing any of these symptoms: difficulty breathing, pain radiating to arm/jaw, sweating, or dizziness? If yes, please use the SOS button immediately.",
    urgency: "urgent",
  },
  breathing: {
    response: "🚨 Difficulty breathing requires immediate attention. If you're struggling to breathe, I'm activating emergency protocols. An ambulance has been dispatched to your location.",
    urgency: "critical",
  },
  fever: {
    response: "A fever can indicate various conditions. What's your current temperature? Are you experiencing any other symptoms like body aches, chills, or sore throat?",
    urgency: "normal",
  },
  default: {
    response: "Thank you for sharing. Could you describe your symptoms in more detail? When did they start, and have you noticed any patterns or triggers?",
    urgency: "normal",
  },
};

const ChatInterface = ({ onBack }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [urgencyLevel, setUrgencyLevel] = useState<"normal" | "urgent" | "critical">("normal");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Call the backend API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          conversationHistory: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      const data = await response.json();
      
      setUrgencyLevel(data.urgency);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment. If you're experiencing a medical emergency, please call emergency services immediately.",
        role: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] pt-16">
      {/* Chat Header */}
      <div className="bg-glass border-b border-border/50 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="font-display font-semibold text-foreground">Healix AI</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success" />
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <UrgencyBadge level={urgencyLevel} />
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            content={message.content}
            role={message.role}
            timestamp={message.timestamp}
          />
        ))}
        
        {isTyping && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span>Healix is typing...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 shrink-0">
        <ChatInput onSend={handleSend} disabled={isTyping} />
      </div>
    </div>
  );
};

export default ChatInterface;
