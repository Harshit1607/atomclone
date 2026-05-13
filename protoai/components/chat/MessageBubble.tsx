import { UIMessage } from "ai";
import { motion } from "framer-motion";
import { Message } from "@/components/ai-elements/message";

interface MessageBubbleProps {
  message: UIMessage;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const isUser = message.role === "user";
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`p-[12px_16px] font-mono text-[14px] leading-[1.7] ${
          isUser
            ? "bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[16px_16px_4px_16px] max-w-[72%]"
            : "bg-transparent border-none max-w-[80%]"
        } ${isStreaming ? "message-streaming" : ""}`}
      >
        <Message message={message} />
      </div>
    </motion.div>
  );
}
