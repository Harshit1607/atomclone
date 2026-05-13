import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { SYSTEM_PROMPT } from "@/lib/constants";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const userApiKey = req.headers.get("x-api-key");

  const model = openai("gpt-4o-mini", {
    apiKey: userApiKey || undefined, // Fallback to process.env.OPENAI_API_KEY if not provided
  });

  const result = await streamText({
    model: model,
    system: SYSTEM_PROMPT,
    messages: messages.map((m: any) => {
      const textPart = m.parts?.find((p: any) => p.type === "text");
      const content = textPart?.text ?? m.content ?? "";
      return {
        role: m.role,
        content: content,
      };
    }),
  });

  return result.toUIMessageStreamResponse();
}
