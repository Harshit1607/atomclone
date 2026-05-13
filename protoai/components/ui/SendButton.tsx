interface SendButtonProps {
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function SendButton({ active, onClick, disabled, className = "" }: SendButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || !active}
      type="submit"
      className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200 shrink-0 ${
        active
          ? "bg-[var(--accent-solid)] text-white"
          : "bg-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
      } ${className}`}
      aria-label="Send message"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </button>
  );
}
