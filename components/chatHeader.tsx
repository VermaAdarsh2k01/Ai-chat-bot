"use client";

import { Button } from "@/components/ui/button";
import { MessageSquarePlus, Store } from "lucide-react";

interface ChatHeaderProps {
  onNewChat: () => void;
  messageCount?: number;
}

export function ChatHeader({ onNewChat, messageCount = 0 }: ChatHeaderProps) {
  return (
    <div className="border-b bg-white shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <Store className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              ShopEasy Support
            </h1>
            <p className="text-xs text-gray-500">
              {messageCount > 0
                ? `${messageCount} messages`
                : "Always here to help"}
            </p>
          </div>
        </div>

        {messageCount > 0 && (
          <Button
            onClick={onNewChat}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <MessageSquarePlus className="h-4 w-4" />
            New Chat
          </Button>
        )}
      </div>
    </div>
  );
}
