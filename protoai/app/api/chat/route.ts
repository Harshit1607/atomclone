import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { SYSTEM_PROMPT } from "@/lib/constants";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai("gpt-oss-120b"),
    system: SYSTEM_PROMPT,
    messages,
  });

  return result.toUIMessageStreamResponse();
}
