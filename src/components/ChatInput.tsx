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
    <div className="bg-glass border border-border/50 rounded-2xl p-2 flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 text-muted-foreground hover:text-primary"
      >
        <Paperclip className="w-5 h-5" />
      </Button>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Describe your symptoms..."
        disabled={disabled}
        className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm"
      />

      <Button
        variant="ghost"
        size="icon"
        onClick={onVoice}
        className="shrink-0 text-muted-foreground hover:text-primary"
      >
        <Mic className="w-5 h-5" />
      </Button>

      <Button
        variant="hero"
        size="icon"
        onClick={handleSend}
        disabled={disabled || !message.trim()}
        className="shrink-0"
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default ChatInput;
