import { SVGProps } from "react";

interface LogoOrbProps {
  size?: "small" | "large";
  onClick?: () => void;
  className?: string;
}

export function LogoOrb({ size = "small", onClick, className = "" }: LogoOrbProps) {
  const dimensions = size === "small" ? "w-[40px] h-[40px]" : "w-[72px] h-[72px]";
  const iconSize = size === "small" ? 20 : 32;

  return (
    <button
      onClick={onClick}
      type="button"
      className={`relative flex items-center justify-center rounded-full bg-[var(--accent-gradient)] hover:scale-105 transition-transform duration-200 ease-in-out shrink-0 ${dimensions} ${className}`}
      aria-label="Open ProtoAI"
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z" />
      </svg>
    </button>
  );
}
