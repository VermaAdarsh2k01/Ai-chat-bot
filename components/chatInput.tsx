"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { toast } from "sonner";

interface ChatInputProps {
  onSend: (message: string) => void;
  loading?: boolean;
  placeholder?: string;
}

function validateMessage(message: string) {
  
  if (message.length < 3) return { valid: false, reason: "Too short" };
  if (message.length > 2000) return { valid: false, reason: "Too long" };
  
  const repeatPattern = /(.)\1{10,}/; 
  if (repeatPattern.test(message)) return { valid: false, reason: "Spam detected" };
  
  return { valid: true };
}

export function ChatInput({
  onSend,
  loading = false,
  placeholder = "Type your message...",
}: ChatInputProps) {
  const [input, setInput] = useState("");

  
  const handleSend = () => {
    if (!input.trim() || loading) return;

    const validation = validateMessage(input.trim());
    
    if (!validation.valid) {
      toast.error(validation.reason || "Invalid message");
      return;
    }

    onSend(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="border-t bg-white p-4">
      <div className="flex gap-2 items-end max-w-4xl mx-auto">
        <Textarea
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={loading ? "AI is responding..." : placeholder}
          disabled={false}
          className="min-h-11 max-h-50 resize-none"
          rows={1}
          maxLength={5000}
        />
        <Button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          size="icon"
          className="h-11 w-11 shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-gray-500 text-center mt-2">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}
