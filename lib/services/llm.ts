import { OpenRouter } from "@openrouter/sdk";
import { Sender } from "../generated/prisma/enums";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY environment variable is not set");
}

const openrouter = new OpenRouter({
  apiKey: OPENROUTER_API_KEY
});

export async function generateReply(
  history: Array<{ sender: Sender; text: string }>,
): Promise<string> {
  try {
    const messages = [
      {
        role: "system" as const,
        content: `You are a helpful customer support agent for "ShopEasy", a fictional e-commerce store.
Be friendly, concise, and helpful.

Store Information:
- Shipping: Free shipping on orders over $50. Standard shipping takes 3-5 business days.
- Returns: 30-day return policy. Items must be unused and in original packaging.
- Support Hours: Monday-Friday, 9 AM - 6 PM EST.
- Payment: We accept all major credit cards and PayPal.
- Contact: support@shopeasy.com or call 1-800-SHOP-NOW

Please respond as the customer support agent.`
      },
      ...history.map(h => ({
        role: h.sender === Sender.user ? "user" as const : "assistant" as const,
        content: h.text
      }))
    ];

    const response = await openrouter.chat.send({
      model: "google/gemma-3-27b-it:free",
      messages,
      stream: false
    });

    const content = response.choices[0]?.message?.content;

    let textContent: string;
    if (typeof content === 'string') {
      textContent = content;
    } else if (Array.isArray(content)) {
      textContent = content
        .filter(item => item.type === 'text')
        .map(item => item.text)
        .join('');
    } else {
      textContent = '';
    }

    if (!textContent || textContent.trim().length === 0) {
      console.error("Empty response from OpenRouter API");
      return "I'm sorry, I couldn't generate a response. Please try again.";
    }

    return textContent.trim();
  } catch (error: any) {
    console.error("OpenRouter API Error:", error);

    if (error.status === 429) {
      return "I'm experiencing high demand right now. Please try again in a moment.";
    }

    if (error.status === 401) {
      return "Authentication error. Please contact support.";
    }

    if (error.status === 500) {
      return "I encountered a technical issue. Please try again or contact support if this persists.";
    }

    return "I'm sorry, I encountered an error processing your request. Please try again.";
  }
}