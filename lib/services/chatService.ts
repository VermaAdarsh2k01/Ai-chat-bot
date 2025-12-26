interface ChatHistoryResponse {
  messages: Array<{
    id?: string;
    sender: string;
    text: string;
    createdAt?: string;
  }>;
}

interface SendMessageResponse {
  reply: string;
  sessionId?: string;
  error?: string;
}

class ChatService {
  async loadHistory(sessionId: string): Promise<ChatHistoryResponse> {
    const response = await fetch(`/api/chat/${sessionId}`);

    if (!response.ok) {
      throw new Error("Failed to load conversation history");
    }

    return response.json();
  }

  async sendMessage(message: string, sessionId: string | null): Promise<SendMessageResponse> {
    const response = await fetch("/api/chat/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        sessionId,
      }),
    });

    const responseText = await response.text();
    
    if (!responseText) {
      throw new Error("Empty response from server");
    }

    let data: SendMessageResponse;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse JSON:", responseText);
      throw new Error("Invalid response format from server");
    }

    if (!response.ok) {
      const errorMessage = data?.error || "Error getting data";
      throw new Error(errorMessage);
    }

    return data;
  }
}

export const chatService = new ChatService();
