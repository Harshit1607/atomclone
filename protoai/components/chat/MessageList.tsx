import React, { useRef, useEffect } from 'react';

interface MessageListProps {
  children: React.ReactNode;
}

export function MessageList({ children }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [children]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto w-full px-4 md:px-0 py-4 flex flex-col gap-[24px] scroll-smooth"
    >
      {children}
    </div>
  );
}
