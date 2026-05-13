import React from 'react';
import { LogoOrb } from '../ui/LogoOrb';

interface ChatPanelProps {
  onClose?: () => void;
  onNewChat?: () => void;
  children: React.ReactNode;
  inputBar?: React.ReactNode;
}

export function ChatPanel({ onClose, onNewChat, children, inputBar }: ChatPanelProps) {
  return (
    <div className="flex flex-col h-full w-full max-w-[720px] mx-auto bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 shrink-0">
        <div className="flex items-center gap-3">
          <LogoOrb size="small" onClick={onClose} />
          <span className="font-sans font-semibold text-[16px]">ProtoAI</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onNewChat}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors"
            aria-label="New Chat"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <button
            className="px-4 py-1.5 text-[13px] font-sans font-semibold text-[var(--bg-primary)] bg-[var(--text-primary)] rounded-full hover:opacity-90 transition-opacity"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        {children}
      </div>

      {/* Input Bar */}
      {inputBar && (
        <div className="shrink-0 pb-6 px-4 md:px-0">
          {inputBar}
        </div>
      )}
    </div>
  );
}
