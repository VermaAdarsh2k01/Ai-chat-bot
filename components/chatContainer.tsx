// components/chat/ChatContainer.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Sender } from "@/lib/generated/prisma/enums";
import { ChatMessage } from "./chatMessage";
import { ChatInput } from "./chatInput";
import { ChatHeader } from "./chatHeader";
import { TypingIndicator } from "./typingIndicator";
import { EmptyState } from "./emptyState";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

type Message = {
  id?: string;
  sender: Sender;
  text: string;
  createdAt?: string;
};

export function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [newChatLoading, setNewChatLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, loading]);

  // Load conversation history on mount
  useEffect(() => {
    const savedSessionId = localStorage.getItem("chatSessionId");
    if (savedSessionId) {
      loadHistory(savedSessionId);
    } else {
      setInitialLoading(false);
    }
  }, []);

  const loadHistory = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/chat/${sessionId}`);

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
        setSessionId(sessionId);
      } else {
        console.error("Failed to load history");
        localStorage.removeItem("chatSessionId");
      }
    } catch (error) {
      console.error("Failed to load history:", error);
      localStorage.removeItem("chatSessionId");
    } finally {
      setInitialLoading(false);
    }
  };

  const sendMessage = async (messageText: string) => {
    // Add user message immediately
    const userMessage: Message = {
      sender: Sender.user,
      text: messageText,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          sessionId: sessionId,
        }),
      });

      // Check if response has content before parsing JSON
      const responseText = await response.text();
      
      if (!responseText) {
        throw new Error("Empty response from server");
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse JSON:", responseText);
        throw new Error("Invalid response format from server");
      }

      if (response.ok) {
        // Add AI reply
        const aiMessage: Message = {
          sender: Sender.ai,
          text: data.reply,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMessage]);

        // Save sessionId
        if (data.sessionId) {
          setSessionId(data.sessionId);
          localStorage.setItem("chatSessionId", data.sessionId);
        }
      } else {
        // Show error toast with server message if available
        const errorMessage = data?.error || "Error getting data";
        toast.error(errorMessage);

        // Remove user message on error
        setMessages((prev) => prev.slice(0, -1));
      }
    } catch (error) {
      console.error("Send message error:", error);
      toast.error("Failed to send message");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    if (loading || newChatLoading) return;

    const confirmNew =
      messages.length > 0
        ? confirm("Start a new conversation? Current chat will be saved.")
        : true;

    if (confirmNew) {
      setNewChatLoading(true);
      
      // Use setTimeout to ensure loading state is visible briefly
      setTimeout(() => {
        setMessages([]);
        setSessionId(null);
        setLoading(false);
        localStorage.removeItem("chatSessionId");
        
        setNewChatLoading(false);
        toast.success("New chat has been created");
      }, 150);
    }
  };

  if (initialLoading || newChatLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">
            {initialLoading ? "Loading conversation..." : "Starting new chat..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="shrink-0">
        <ChatHeader onNewChat={startNewChat} messageCount={messages.length} />
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
        <ChatInput onSend={sendMessage} disabled={loading || newChatLoading} />
      </div>
    </div>
  );
}
