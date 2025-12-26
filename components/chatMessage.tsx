// components/chat/ChatMessage.tsx
"use client";

import { Sender } from "@/lib/generated/prisma/enums";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  sender: Sender;
  text: string;
  timestamp?: string;
}

export function ChatMessage({ sender, text, timestamp }: ChatMessageProps) {
  const isUser = sender === Sender.user;

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <Avatar className={`h-8 w-8 ${isUser ? "bg-blue-500" : "bg-gray-700"}`}>
        <AvatarFallback>
          {isUser ? (
            <User className="h-4 w-4 text-blue-500" />
          ) : (
            <Bot className="h-4 w-4 text-white" />
          )}
        </AvatarFallback>
      </Avatar>

      {/* Message bubble */}
      <div
        className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[70%]`}
      >
        <div
          className={`px-4 py-2.5 rounded-2xl ${
            isUser
              ? "bg-blue-500 text-white rounded-br-sm"
              : "bg-gray-100 text-gray-900 rounded-bl-sm"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
            {text}
          </p>
        </div>

        {timestamp && (
          <span className="text-xs text-gray-500 mt-1 px-1">
            {new Date(timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>
    </div>
  );
}
