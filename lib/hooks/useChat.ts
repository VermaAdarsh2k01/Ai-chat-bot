import { useState, useEffect } from "react";
import { toast } from "sonner";

type Sender = "user" | "ai";
import { chatService } from "@/lib/services/chatService";

export type Message = {
  id?: string;
  sender: Sender;
  text: string;
  createdAt?: string;
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

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
      const data = await chatService.loadHistory(sessionId);

      const messages = data.messages.map(msg => ({
        ...msg,
        sender: msg.sender as Sender
      }));
      setMessages(messages);
      setSessionId(sessionId);
    } catch (error) {
      console.error("Failed to load history:", error);
      localStorage.removeItem("chatSessionId");
    } finally {
      setInitialLoading(false);
    }
  };

  const sendMessage = async (messageText: string) => {
    const userMessage: Message = {
      sender: "user",
      text: messageText,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const data = await chatService.sendMessage(messageText, sessionId);
      
      const aiMessage: Message = {
        sender: "ai",
        text: data.reply,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      if (data.sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem("chatSessionId", data.sessionId);
      }
    } catch (error) {
      console.error("Send message error:", error);
      
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to send message");
      }
      
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    sessionId,
    loading,
    initialLoading,
    sendMessage,
  };
}
