import { Mic, Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  onVoice?: () => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, onVoice, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-glass border border-border/50 rounded-2xl p-1.5 sm:p-2 flex items-center gap-1 sm:gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 text-muted-foreground hover:text-primary h-8 w-8 sm:h-10 sm:w-10"
      >
        <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
      </Button>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Describe your symptoms..."
        disabled={disabled}
        className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm min-w-0"
      />

      <Button
        variant="ghost"
        size="icon"
        onClick={onVoice}
        className="shrink-0 text-muted-foreground hover:text-primary h-8 w-8 sm:h-10 sm:w-10 hidden sm:flex"
      >
        <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
      </Button>

      <Button
        variant="hero"
        size="icon"
        onClick={handleSend}
        disabled={disabled || !message.trim()}
        className="shrink-0 h-8 w-8 sm:h-10 sm:w-10"
      >
        <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </Button>
    </div>
  );
};

export default ChatInput;
