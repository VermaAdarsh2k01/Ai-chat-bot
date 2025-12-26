# AI Chat Application

A modern, real-time chat application built with Next.js 16, featuring AI-powered responses using OpenRouter's API and persistent conversation storage with PostgreSQL.

## Features

- 🤖 AI-powered chat responses using Google Gemma 3 27B model
- 💬 Persistent conversation history
- 🎨 Modern UI with Tailwind CSS and Radix UI components
- 📱 Responsive design
- ⚡ Real-time typing indicators
- 🔄 Auto-scroll functionality
- 🛡️ Input validation and error handling
- 🔊 Text-to-speech for AI responses with play/pause/stop controls (completely Vibecoded)

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI , ShadCn
- **Database**: PostgreSQL with Prisma ORM
- **AI Provider**: OpenRouter (Google Gemma 3 27B model)
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- OpenRouter API key

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd my-chat-app
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/chatapp_db"

# AI Provider
OPENROUTER_API_KEY="your_openrouter_api_key_here"

# Optional
NODE_ENV="development"
```

#### Getting API Keys

**OpenRouter API Key:**
1. Visit [OpenRouter.ai](https://openrouter.ai/)
2. Sign up for an account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `.env.local` file

### 3. Database Setup

#### Option A: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database:
```sql
CREATE DATABASE chatapp_db;
```

3. Update your `DATABASE_URL` in `.env.local`

#### Option B: Cloud Database (Recommended)

Use services like:
- [Supabase](https://supabase.com/) (Free tier available)
- [Railway](https://railway.app/)
- [Neon](https://neon.tech/)

### 4. Run Database Migrations

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Optional: View your database
npx prisma studio
```

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## Database Schema

The application uses a simple but effective schema:

```prisma
model Conversation {
  id        String    @id @default(uuid())
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  messages  Message[]
}

model Message {
  id             String       @id @default(uuid())
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id])
  sender         Sender       // enum: user | ai
  text           String
  createdAt      DateTime     @default(now())
}
```

## Architecture Overview

### Backend Structure

The application follows a clean, layered architecture:

```
app/api/                    # API Routes (App Router)
├── chat/
│   ├── [sessionId]/       # GET conversation history
│   └── message/           # POST new messages
│
lib/                       # Core business logic
├── services/
│   ├── llm.ts            # AI service integration
│   └── chatService.ts    # Frontend API client
├── hooks/                # Custom React hooks
│   ├── useChat.ts        # Chat state management
│   └── useAutoScroll.ts  # Auto-scroll behavior
├── generated/prisma/     # Generated Prisma client
└── prisma.ts            # Database connection
│
components/               # UI Components
├── ui/                  # Reusable UI primitives
└── chat*/               # Chat-specific components
```

### Key Design Decisions

1. **Session-based Conversations**: Each chat session gets a unique UUID, allowing users to maintain multiple conversation threads.

2. **Optimistic UI Updates**: Messages appear immediately in the UI while being processed in the background.

3. **Error Boundary Strategy**: Comprehensive error handling at API, service, and component levels with user-friendly fallbacks.

4. **Database Connection Pooling**: Uses `@prisma/adapter-pg` with connection pooling for better performance.

5. **Generated Prisma Client**: Custom output directory (`lib/generated/prisma`) to avoid conflicts and improve organization.

6. **Conversation History Limiting**: Only loads the last 10 messages for AI context to manage token usage and response time.

## LLM Integration

### Provider: OpenRouter

We use **OpenRouter** as our LLM provider, which offers:
- Access to multiple AI models through a single API
- Competitive pricing
- Good reliability and uptime
- Easy model switching

### Current Model: Google Gemma 3 27B (Free Tier)

```typescript
model: "google/gemma-3-27b-it:free"
```

### Prompting Strategy

The AI is configured as a **customer support agent for TechGear Store** with:

- **System Prompt**: Detailed store information including shipping, returns, support hours
- **Context Window**: Last 10 messages for conversation continuity
- **Error Handling**: Graceful fallbacks for API failures, rate limits, and authentication issues
- **Response Validation**: Ensures non-empty responses with fallback messages

### Prompt Engineering

```typescript
const systemPrompt = `You are a helpful support agent for TechGear Store, an e-commerce shop selling electronics.

Store Information:
- Shipping Policy: Free shipping on orders over $50 within the US
- Return Policy: 30-day return policy for unopened items
- Support Hours: Monday-Friday 9 AM - 6 PM EST
- International Shipping: Canada and Mexico (7-14 days)
- Payment Methods: Visa, Mastercard, UPI, American Express, PayPal, Apple Pay

Answer questions clearly and concisely. If you don't know something, offer to connect them with a human agent.`;
```

## Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npx prisma generate  # Generate Prisma client
npx prisma migrate dev # Run migrations
npx prisma studio    # Open database GUI
npx prisma db push   # Push schema changes (dev only)
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Environment Variables for Production

```env
DATABASE_URL="your_production_database_url"
OPENROUTER_API_KEY="your_openrouter_api_key"
NODE_ENV="production"
```

## Trade-offs & Future Improvements

### Current Trade-offs

1. **Single AI Provider**: Currently locked to OpenRouter. Could abstract to support multiple providers.

2. **Limited Context Window**: Only 10 messages for AI context to manage costs and latency.

3. **No User Authentication**: Sessions are anonymous. Adding auth would enable user-specific history.

4. **No Message Streaming**: Responses are sent as complete messages rather than streamed tokens.

5. **Basic Error Handling**: Could implement more sophisticated retry logic and error recovery.

### "If I Had More Time..."

#### High Priority
- **User Authentication**: Implement NextAuth.js for user accounts and personalized chat history
- **Message Streaming**: Add real-time streaming responses using Server-Sent Events or WebSockets
- **Multi-Provider Support**: Abstract LLM service to support OpenAI, Anthropic, and others
- **Advanced Error Recovery**: Implement exponential backoff, circuit breakers, and graceful degradation

#### Medium Priority
- **Message Reactions**: Allow users to rate AI responses (👍/👎)
- **Conversation Management**: Add ability to delete, rename, or archive conversations
- **File Uploads**: Support image and document uploads for richer conversations
- **Search Functionality**: Search through conversation history

#### Nice to Have
- **Voice Messages**: Speech-to-text integration (text-to-speech already implemented)
- **Conversation Sharing**: Share conversations via unique links
- **Admin Dashboard**: Monitor usage, costs, and system health
- **A/B Testing**: Test different prompts and models
- **Analytics**: Track user engagement and conversation metrics

### Performance Optimizations
- **Redis Caching**: Cache frequent queries and AI responses
- **CDN Integration**: Serve static assets from CDN
- **Database Indexing**: Add composite indexes for better query performance
- **Connection Pooling**: Optimize database connection management
- **Rate Limiting**: Implement user-based rate limiting


## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include error messages, environment details, and steps to reproduce

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.