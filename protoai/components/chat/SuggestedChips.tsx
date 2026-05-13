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
          className="px-6 py-2.5 rounded-full border border-dashed border-[#555555] bg-transparent font-sans font-medium text-[14px] text-white hover:text-black hover:bg-white hover:border-white transition-all duration-200 whitespace-nowrap"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
