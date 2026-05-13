"use client";

import React, { useState, useRef } from "react";
import { ChatWidgetProps } from "@/types/chat";
import { InputPill } from "./InputPill";
import { ChatPanel } from "./ChatPanel";
import { DEFAULT_API_ENDPOINT } from "@/lib/constants";
import { LogoOrb } from "../ui/LogoOrb";
import { SuggestedChips } from "./SuggestedChips";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./MessageList";

export function ChatWidget({ apiEndpoint = DEFAULT_API_ENDPOINT }: ChatWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  
  const panelRef = useRef<HTMLDivElement>(null);

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    setIsInputFocused(false);
  };

  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col justify-end items-center z-50 p-4 md:p-8">
      {!isExpanded && (
        <div className="pointer-events-auto pb-8 w-full max-w-[680px]">
          <InputPill
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onSubmit={() => {
              handleExpand();
              // In step 8 this will submit the message
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
              onNewChat={() => {}}
              inputBar={
                <ChatInput 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onSubmit={(e) => {
                    e.preventDefault();
                    // Handle submit later
                  }}
                />
              }
            >
              {/* For Step 6, we'll just show the Intro block. We'll wire up messages in Step 7/8. */}
              <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                <LogoOrb size="large" className="mb-6" />
                <h2 className="font-sans font-semibold text-2xl text-[var(--text-primary)] mb-4">I am ProtoAI - Your atomic companion</h2>
                <p className="text-[var(--text-secondary)] font-mono text-[14px] leading-[1.7] max-w-[400px] mb-8">
                  I help you understand Atoms, clear your questions, and guide you through the application when you're ready.
                </p>
                <div className="text-[var(--text-primary)] font-sans font-semibold text-[15px] mb-4">
                  Choose a prompt or ask me anything
                </div>
                <SuggestedChips onSelect={(label) => setInputValue(label)} />
              </div>
            </ChatPanel>
          </div>
        </div>
      )}
    </div>
  );
}
