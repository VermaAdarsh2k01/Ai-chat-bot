"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8 bg-gray-700">
        <AvatarFallback>
          <Bot className="h-4 w-4 text-white" />
        </AvatarFallback>
      </Avatar>

      <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce-dot" />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce-dot" />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce-dot" />
        </div>
      </div>
    </div>
  );
}
