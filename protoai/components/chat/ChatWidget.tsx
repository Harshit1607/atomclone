"use client";

import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { ChatWidgetProps } from "@/types/chat";
import { InputPill } from "./InputPill";
import { ChatPanel } from "./ChatPanel";
import { DEFAULT_API_ENDPOINT } from "@/lib/constants";
import { LogoOrb } from "../ui/LogoOrb";
import { SuggestedChips } from "./SuggestedChips";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./MessageList";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { useProtoChat } from "@/hooks/useProtoChat";
import { newSession } from "@/store/sessionSlice";

export function ChatWidget({ apiEndpoint = DEFAULT_API_ENDPOINT }: ChatWidgetProps) {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  
  const panelRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useProtoChat({
    apiEndpoint,
  });

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    setIsInputFocused(false);
  };

  const handleNewChat = () => {
    dispatch(newSession());
    handleCollapse();
  };

  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col justify-end items-center z-50 p-4 md:p-8">
      {!isExpanded && (
        <div className="pointer-events-auto pb-8 w-full max-w-[680px]">
          <InputPill
            value={input}
            onChange={handleInputChange}
            onSubmit={(e) => {
              handleExpand();
              handleSubmit(e);
            }}
            onOrbClick={handleExpand}
            isFocused={isInputFocused}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
          />
        </div>
      )}

      {isExpanded && (
        <div className="absolute inset-0 pointer-events-auto bg-black/60 flex items-center justify-center p-4 md:p-8 backdrop-blur-sm">
          <div 
            ref={panelRef}
            className="w-full h-full max-h-[800px] max-w-[720px] bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-2xl flex flex-col relative"
          >
            <ChatPanel
              onClose={handleCollapse}
              onNewChat={handleNewChat}
              inputBar={
                <ChatInput 
                  value={input}
                  onChange={handleInputChange}
                  onSubmit={handleSubmit}
                  disabled={isLoading}
                />
              }
            >
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                  <LogoOrb size="large" className="mb-6" />
                  <h2 className="font-sans font-semibold text-2xl text-[var(--text-primary)] mb-4">I am ProtoAI - Your atomic companion</h2>
                  <p className="text-[var(--text-secondary)] font-mono text-[14px] leading-[1.7] max-w-[400px] mb-8">
                    I help you understand Atoms, clear your questions, and guide you through the application when you're ready.
                  </p>
                  <div className="text-[var(--text-primary)] font-sans font-semibold text-[15px] mb-4">
                    Choose a prompt or ask me anything
                  </div>
                  <SuggestedChips 
                    onSelect={(label) => {
                      append({ role: 'user', content: label });
                    }} 
                  />
                </div>
              ) : (
                <MessageList>
                  {messages.map((m) => (
                    <MessageBubble key={m.id} message={m} />
                  ))}
                  {isLoading && messages[messages.length - 1]?.role === "user" && (
                    <TypingIndicator />
                  )}
                </MessageList>
              )}
            </ChatPanel>
          </div>
        </div>
      )}
    </div>
  );
}
