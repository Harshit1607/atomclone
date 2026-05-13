import React, { useRef, useEffect } from 'react';

interface MessageListProps {
  children: React.ReactNode;
}

export function MessageList({ children }: MessageListProps) {
  return (
    <div
      className="w-full px-4 md:px-0 py-8 flex flex-col gap-[32px]"
    >
      {children}
    </div>
  );
}
