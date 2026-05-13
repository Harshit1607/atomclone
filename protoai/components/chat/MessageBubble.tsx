import { UIMessage } from "ai";
import { motion } from "framer-motion";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";

interface MessageBubbleProps {
  message: UIMessage;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const textPart = message.parts?.find((p: any) => p.type === "text") as any;
  const content = textPart?.text ?? (message as any).content ?? "";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      {isUser ? (
        <div className="p-[12px_16px] font-mono text-[14px] leading-[1.7] bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[16px_16px_4px_16px] max-w-[72%]">
          {content}
        </div>
      ) : (
        <div className={`max-w-[80%] ${isStreaming ? "message-streaming" : ""}`}>
          <Message from="assistant">
            <MessageContent>
              <MessageResponse isAnimating={isStreaming}>{content}</MessageResponse>
            </MessageContent>
          </Message>
        </div>
      )}
    </motion.div>
  );
}
