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
      className={`relative flex items-center justify-center rounded-full overflow-hidden hover:scale-105 transition-transform duration-200 ease-in-out shrink-0 ${dimensions} ${className}`}
      aria-label="Open ProtoAI"
      style={{
        background: "radial-gradient(circle at 30% 30%, #4facfe 0%, #00f2fe 100%), radial-gradient(circle at 70% 70%, #f093fb 0%, #f5576c 100%)",
        backgroundBlendMode: "screen"
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#4facfe] via-[#f093fb] to-[#f5576c] opacity-80" />
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="relative z-10"
      >
        <path d="M12 3c.5 4.5 4.5 8.5 9 9-4.5.5-8.5 4.5-9 9-.5-4.5-4.5-8.5-9-9 4.5-.5 8.5-4.5 9-9z" />
        <path d="M15 15l3 3m0 0l-1-2m1 2l-2-1" />
      </svg>
    </button>
  );
}
