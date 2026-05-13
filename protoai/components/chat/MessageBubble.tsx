import { Message } from "ai-elements";
import type { Message as AIMessage } from "ai";

interface MessageBubbleProps {
  message: AIMessage;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const isUser = message.role === "user";
  
  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`p-[12px_16px] font-mono text-[14px] leading-[1.7] ${
          isUser
            ? "bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[16px_16px_4px_16px] max-w-[72%]"
            : "bg-transparent border-none max-w-[80%]"
        } ${isStreaming ? "message-streaming" : ""}`}
      >
        <Message message={message} />
      </div>
    </div>
  );
}
