import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { SYSTEM_PROMPT } from "@/lib/constants";

export const runtime = "edge";

// Basic in-memory rate limiting map for MVP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export async function POST(req: Request) {
  const sessionId = req.headers.get("x-session-id") || "anonymous";

  // Rate Limiting (10 req / minute)
  const now = Date.now();
  const windowMs = 60 * 1000;
  
  let record = rateLimitMap.get(sessionId);
  if (!record || now > record.resetAt) {
    record = { count: 0, resetAt: now + windowMs };
  }
  
  if (record.count >= 10) {
    return new Response("Rate limit exceeded. Please try again later.", { status: 429 });
  }
  
  record.count += 1;
  rateLimitMap.set(sessionId, record);

  const { messages } = await req.json();

  const result = await streamText({
    model: google("gemini-1.5-flash"),
    system: SYSTEM_PROMPT,
    messages,
  });

  return result.toDataStreamResponse();
}
