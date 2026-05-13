import React from 'react';
import { SendButton } from '../ui/SendButton';

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled?: boolean;
}

export function ChatInput({ value, onChange, onSubmit, disabled }: ChatInputProps) {
  return (
    <form 
      onSubmit={onSubmit}
      className="flex items-center w-full max-w-[720px] mx-auto bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[28px] h-[56px] pl-6 pr-2 focus-within:border-[#3A3A3A] transition-colors shadow-[0_-12px_24px_rgba(0,0,0,0.4)]"
    >
      <input
        type="text"
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder="Ask anything..."
        className="flex-1 bg-transparent border-none outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)] font-mono text-[14px] leading-[1.7]"
      />
      <SendButton
        active={value.trim().length > 0}
        disabled={disabled}
        className="ml-2 shrink-0"
      />
    </form>
  );
}
