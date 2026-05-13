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
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export function ChatWidget({ apiEndpoint = DEFAULT_API_ENDPOINT }: ChatWidgetProps) {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  
  const panelRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useProtoChat({
    apiEndpoint,
  });

  useGSAP(() => {
    if (isExpanded && panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { clipPath: "inset(50% 0 50% 0)", opacity: 0, y: 50 },
        { clipPath: "inset(0% 0 0% 0)", opacity: 1, y: 0, duration: 0.48, ease: "power3.out" }
      );
    }
  }, [isExpanded]);


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
    <div className={`fixed inset-0 z-50 ${isExpanded ? "pointer-events-auto" : "pointer-events-none"} flex flex-col justify-end items-center p-4 md:p-8`}>
      {!isExpanded && (
        <div className="pointer-events-auto pb-8 w-full max-w-[680px] flex justify-center">
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
        <div className="absolute inset-0 bg-black flex flex-col z-[100]">
          {/* Header */}
          <header className="h-16 flex items-center justify-between px-6 border-b border-[#333333]">
            <div className="flex items-center gap-2">
              <span className="font-sans font-bold text-xl text-white tracking-tight">ProtoAI</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleNewChat}
                className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-white text-white hover:bg-white hover:text-black transition-all"
                title="New Chat"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <button className="bg-white text-black px-4 py-1.5 rounded-none font-sans font-bold text-sm hover:bg-gray-200 transition-colors">
                Apply Now
              </button>
              <button 
                onClick={handleCollapse}
                className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-white text-white hover:bg-white hover:text-black transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-black">
            <div 
              ref={panelRef}
              className="w-full h-full flex flex-col"
            >
              <ChatPanel
                onClose={handleCollapse}
                onNewChat={handleNewChat}
                inputBar={
                  <div className="w-full flex justify-center pb-8 px-4">
                    <div className="w-full max-w-[900px]">
                      <ChatInput 
                        value={input}
                        onChange={handleInputChange}
                        onSubmit={handleSubmit}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                }
              >
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full px-6 text-center max-w-4xl mx-auto">
                    <LogoOrb size="large" className="mb-8" />
                    <h2 className="font-sans font-bold text-3xl text-white mb-6">I am ProtoAI - Your atomic companion</h2>
                    <p className="text-[#999999] font-sans text-lg leading-relaxed max-w-2xl mb-10">
                      I help you understand Atoms, clear your questions, and guide you through the application when you're ready.
                    </p>
                    <div className="text-white font-sans font-medium text-lg mb-6">
                      Choose a prompt below or simply ask me anything
                    </div>
                    <SuggestedChips 
                      onSelect={(label) => {
                        append({ role: 'user', content: label });
                      }} 
                    />
                  </div>
                ) : (
                  <div className="w-full max-w-4xl mx-auto flex-1">
                    <MessageList>
                      {messages.map((m) => (
                        <MessageBubble 
                          key={m.id} 
                          message={m} 
                          onSuggestionClick={(label: string) => {
                            append({ role: 'user', content: label });
                          }}
                        />
                      ))}
                      {isLoading && messages[messages.length - 1]?.role === "user" && (
                        <TypingIndicator />
                      )}
                    </MessageList>
                  </div>
                )}
              </ChatPanel>
            </div>

            {/* Footer Disclaimer */}
            <div className="py-4 text-center">
              <p className="text-[#555555] text-xs font-sans">
                © AI may be imperfect at times. Please re-check the responses.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
