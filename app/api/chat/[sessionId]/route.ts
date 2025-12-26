// app/api/chat/[sessionId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    const conversation = await prisma.conversation.findUnique({
      where: { id: sessionId },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    const messages = await prisma.message.findMany({
      where: { conversationId: sessionId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        sender: true,
        text: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      sessionId: sessionId,
      messages: messages,
    });

  } catch (error) {
    console.error('Get History Error:', error);
    return NextResponse.json(
      { error: 'Failed to load conversation history' },
      { status: 500 }
    );
  }
}