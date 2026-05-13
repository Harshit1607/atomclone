import React from 'react';
import { CHIP_LABELS } from '@/lib/constants';

interface SuggestedChipsProps {
  onSelect: (label: string) => void;
}

export function SuggestedChips({ onSelect }: SuggestedChipsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-8 max-w-full overflow-x-auto pb-2">
      {CHIP_LABELS.map((label, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(label)}
          className="px-4 py-2 rounded-full border border-[var(--border)] bg-transparent font-sans font-medium text-[13px] text-[var(--text-primary)] hover:border-[#555] hover:bg-[#222] transition-colors duration-200 whitespace-nowrap"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
