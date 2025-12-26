"use client";

import { Store } from "lucide-react";

interface ChatHeaderProps {
  messageCount?: number;
}

export function ChatHeader({ messageCount = 0 }: ChatHeaderProps) {
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
      </div>
    </div>
  );
}
