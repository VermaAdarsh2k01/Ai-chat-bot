"use client";

import { ChatInput } from "./chatInput";
import { ChatHeader } from "./chatHeader";
import { ChatMessage } from "./chatMessage";
import { TypingIndicator } from "./typingIndicator";
import { EmptyState } from "./emptyState";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/lib/hooks/useChat";
import { useAutoScroll } from "@/lib/hooks/useAutoScroll";
import { LoadingSpinner } from "./LoadingSpinner";

export function ChatContainer() {
  const { messages, loading, initialLoading, sendMessage } = useChat();
  const scrollAreaRef = useAutoScroll([messages, loading]);

  if (initialLoading) {
    return <LoadingSpinner message="Loading conversation..." />;
  }


  return (
    <div className="flex flex-col h-[90vh] lg:h-screen bg-gray-50">
      <div className="shrink-0">
        <ChatHeader messageCount={messages.length} />
      </div>
      
      <div className="flex-1 min-h-0">
        <ScrollArea ref={scrollAreaRef} className="h-full px-4">
          <div className="max-w-4xl mx-auto py-6 space-y-6">
            {messages.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                {messages.map((msg, i) => (
                  <ChatMessage
                    key={msg.id || i}
                    sender={msg.sender}
                    text={msg.text}
                    timestamp={msg.createdAt}
                  />
                ))}
                {loading && <TypingIndicator />}
              </>
            )}
          </div>
        </ScrollArea>
      </div>
      <div className="shrink-0">
        <ChatInput onSend={sendMessage} loading={loading} />
      </div>
    </div>
  );
}
