import React from 'react';

export function TypingIndicator() {
  return (
    <div className="flex w-full justify-start">
      <div className="flex items-center gap-1.5 p-[14px_16px] bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[16px_16px_16px_4px]">
        <div className="w-1.5 h-1.5 bg-[var(--text-secondary)] rounded-full"></div>
        <div className="w-1.5 h-1.5 bg-[var(--text-secondary)] rounded-full"></div>
        <div className="w-1.5 h-1.5 bg-[var(--text-secondary)] rounded-full"></div>
      </div>
    </div>
  );
}
