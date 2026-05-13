import { UIMessage } from "ai";
import { motion } from "framer-motion";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import React from "react";

interface MessageBubbleProps {
  message: UIMessage;
  isStreaming?: boolean;
  onSuggestionClick?: (suggestion: string) => void;
}

export function MessageBubble({ message, isStreaming, onSuggestionClick }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const textPart = message.parts?.find((p: any) => p.type === "text") as any;
  const content = textPart?.text ?? (message as any).content ?? "";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex w-full mb-8 ${isUser ? "justify-end px-6" : "justify-start px-6"}`}
    >
      {isUser ? (
        <div className="p-[12px_24px] font-sans font-medium text-[15px] bg-white text-black rounded-[24px_24px_4px_24px] max-w-[70%] shadow-lg">
          {content}
        </div>
      ) : (
        <div className={`max-w-[90%] flex flex-col gap-4 ${isStreaming ? "message-streaming" : ""}`}>
          <div className="flex gap-4">
            {/* Assistant Icon */}
            <div className="w-10 h-10 shrink-0 rounded-full bg-[#1a1a1a] border border-[#333333] flex items-center justify-center">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3c.5 4.5 4.5 8.5 9 9-4.5.5-8.5 4.5-9 9-.5-4.5-4.5-8.5-9-9 4.5-.5 8.5-4.5 9-9z" />
              </svg>
            </div>
            
            <div className="flex flex-col gap-2 text-white !text-white">
              <Message from="assistant">
                <MessageContent className="!text-white">
                  <MessageResponse isAnimating={isStreaming} className="text-white !text-white">{content}</MessageResponse>
                </MessageContent>
              </Message>

              {/* Action Buttons */}
              {!isStreaming && (
                <div className="flex items-center gap-4 mt-2">
                  <button className="text-[#555555] hover:text-white transition-colors" title="Like">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                    </svg>
                  </button>
                  <button className="text-[#555555] hover:text-white transition-colors" title="Dislike">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
                    </svg>
                  </button>
                  <button 
                    className="ml-auto text-[#555555] hover:text-white transition-colors" 
                    title="Copy"
                    onClick={() => navigator.clipboard.writeText(content)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Follow-up Suggestions */}
          {!isStreaming && (
            <div className="flex flex-col gap-4 mt-4 ml-14">
              <span className="text-[10px] font-bold text-[#555555] tracking-widest uppercase">What you might find useful:</span>
              <div className="flex flex-wrap gap-2">
                {["What is the typical equity stake?", "How does Atoms' global network work?", "What start-ups are considered pre-seed?"].map((s, i) => (
                  <button 
                    key={i} 
                    onClick={() => onSuggestionClick?.(s)}
                    className="px-4 py-2 rounded-full border border-dashed border-[#333333] text-[#999999] text-[13px] hover:bg-white hover:text-black hover:border-white transition-all duration-200"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
