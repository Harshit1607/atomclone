import { google } from '@ai-sdk/google';
import { streamText } from "ai";
import { SYSTEM_PROMPT } from "@/lib/constants";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: google('gemini-2.5-flash'),
    system: SYSTEM_PROMPT,
    messages,
  });

  return result.toUIMessageStreamResponse();
}
