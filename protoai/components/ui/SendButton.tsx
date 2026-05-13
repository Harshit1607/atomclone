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
      className={`flex items-center justify-center w-10 h-10 bg-[#333333] hover:bg-[#444444] text-white transition-colors duration-200 shrink-0 ${
        active ? "opacity-100" : "opacity-50"
      } ${className}`}
      aria-label="Send message"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
      </svg>
    </button>
  );
}
