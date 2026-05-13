import React from 'react';
import { LogoOrb } from '../ui/LogoOrb';

interface ChatPanelProps {
  onClose?: () => void;
  onNewChat?: () => void;
  children: React.ReactNode;
  inputBar?: React.ReactNode;
}

export function ChatPanel({ onClose, onNewChat, children, inputBar }: ChatPanelProps) {
  const [showScrollButton, setShowScrollButton] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // Show button if we're more than 200px from the bottom
    setShowScrollButton(scrollHeight - scrollTop - clientHeight > 200);
  };

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior
      });
    }
  };

  // Auto-scroll on content change
  React.useEffect(() => {
    // Only auto-scroll if we were already near the bottom or it's a very short list
    const container = scrollRef.current;
    if (container) {
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 300;
      if (isNearBottom || container.scrollTop === 0) {
        scrollToBottom('smooth');
      }
    }
  }, [children]);

  return (
    <div className="flex flex-col h-full w-full bg-black text-white relative">
      {/* Content Area */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col pt-12 pb-24"
      >
        {children}
      </div>

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <button
          onClick={() => scrollToBottom('smooth')}
          className="absolute bottom-32 left-1/2 -translate-x-1/2 w-10 h-10 bg-[#1a1a1a] border border-[#333333] rounded-full flex items-center justify-center text-white shadow-xl hover:bg-[#333333] transition-all z-[110]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
          </svg>
        </button>
      )}

      {/* Input Bar */}
      {inputBar && (
        <div className="shrink-0 relative z-[100]">
          {inputBar}
        </div>
      )}
    </div>
  );
}
