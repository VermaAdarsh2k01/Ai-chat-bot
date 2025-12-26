"use client";

import { MessageCircle, Package, RefreshCw, Clock } from "lucide-react";

export function EmptyState() {
  const suggestions = [
    {
      icon: Package,
      text: "What's your return policy?",
    },
    {
      icon: RefreshCw,
      text: "How long does shipping take?",
    },
    {
      icon: Clock,
      text: "What are your support hours?",
    },
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
      <div className="text-center max-w-md">
        <div className="h-10 w-10 lg:h-16 lg:w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="h-8 w-8 text-blue-500" />
        </div>

        <h2 className="text-lg lg:text-2xl font-semibold text-gray-900 mb-2">
          Welcome to ShopEasy Support! 👋
        </h2>

        <p className="text-gray-600 text-sm lg:text-base mb-6">
          How can we help you today? Ask us anything about our products,
          shipping, or returns.
        </p>

        <div className="space-y-2 lg:w-[60%] mx-auto">
          <p className="text-sm font-medium text-gray-700 mb-3">Try asking:</p>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-left hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <suggestion.icon className="h-5 w-5 text-gray-400 shrink-0" />
              <span className="text-sm text-gray-700">{suggestion.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
