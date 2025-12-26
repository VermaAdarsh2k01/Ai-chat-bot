import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Sender } from "@/lib/generated/prisma/enums";
import { generateReply } from "@/lib/services/llm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, sessionId } = body;

    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Message cannot be empty" },
        { status: 400 },
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: "Message too long (max 5000 characters)" },
        { status: 400 },
      );
    }

    let conversationId = sessionId;

    if (!conversationId) {
      let conversation = await prisma.conversation.create({
        data: {},
      });
      conversationId = conversation.id;
    } else {
      const convExists = await prisma.conversation.findUnique({
        where: {
          id: conversationId,
        },
      });

      if (!convExists) {
        return NextResponse.json(
          { error: "Invalid session-id" },
          { status: 404 },
        );
      }
    }

    // Save user message
    await prisma.message.create({
      data: {
        conversationId,
        sender: Sender.user,
        text: message.trim(),
      },
    });

    // Get conversation history
    const history = await prisma.message.findMany({
      where: {
        conversationId: conversationId,
      },
      orderBy: { createdAt: "asc" },
      take: 10,
      select: {
        sender: true,
        text: true,
      },
    });

    // Generate AI response
    const aiResponse = await generateReply(history);

    // Save AI response
    await prisma.message.create({
      data: {
        conversationId,
        sender: Sender.ai,
        text: aiResponse,
      },
    });

    return NextResponse.json({
      reply: aiResponse,
      sessionId: conversationId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process message. Please try again." },
      { status: 500 },
    );
  }
}
