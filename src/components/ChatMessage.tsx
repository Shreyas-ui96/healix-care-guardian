import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant";
  timestamp?: string;
}

const ChatMessage = ({ content, role, timestamp }: ChatMessageProps) => {
  const isBot = role === "assistant";

  return (
    <div
      className={cn(
        "flex gap-2 sm:gap-3 animate-fade-in",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      {isBot && (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-primary flex items-center justify-center shrink-0 shadow-glow">
          <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
        </div>
      )}
      
      <div
        className={cn(
          "max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 shadow-card",
          isBot
            ? "bg-card border border-border rounded-bl-sm"
            : "bg-gradient-primary text-primary-foreground rounded-br-sm"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{content}</p>
        {timestamp && (
          <span className={cn(
            "text-xs mt-2 block",
            isBot ? "text-muted-foreground" : "text-primary-foreground/70"
          )}>
            {timestamp}
          </span>
        )}
      </div>

      {!isBot && (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
          <User className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
