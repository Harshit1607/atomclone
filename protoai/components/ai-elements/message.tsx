"use client";

import { UIMessage } from "ai";
import ReactMarkdown from "react-markdown";

interface MessageProps {
  message: UIMessage;
}

export function Message({ message }: MessageProps) {
  const textPart = message.parts?.find((p: any) => p.type === "text");
  const content = textPart ? (textPart as any).text : (message as any).content ?? "";

  return (
    <div className="prose prose-invert max-w-none text-[14px] font-mono leading-[1.7]">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
