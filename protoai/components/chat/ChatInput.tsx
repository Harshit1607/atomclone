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
      className="flex items-center w-full bg-[#1a1a1a] border border-[#333333] h-[72px] px-4 transition-colors relative"
    >
      <div className="flex-1 bg-[#262626] h-[48px] flex items-center px-4">
        <input
          type="text"
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder="Ask anything..."
          className="flex-1 bg-transparent border-none outline-none text-[#999999] placeholder-[#555555] font-sans text-[16px]"
        />
      </div>
      <SendButton
        active={value.trim().length > 0}
        disabled={disabled}
        className="ml-4 shrink-0"
      />
    </form>
  );
}
