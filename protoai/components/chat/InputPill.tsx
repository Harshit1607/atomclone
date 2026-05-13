import { LogoOrb } from "../ui/LogoOrb";
import { SendButton } from "../ui/SendButton";

interface InputPillProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onOrbClick: () => void;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  className?: string;
}

export function InputPill({
  value,
  onChange,
  onSubmit,
  onOrbClick,
  isFocused,
  onFocus,
  onBlur,
  className = "",
}: InputPillProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit();
    }
  };

  return (
    <div
      className={`flex items-center h-[56px] bg-[var(--bg-elevated)] border rounded-[28px] pl-2 pr-2 transition-all duration-300 ease-[cubic-bezier(0.32,0,0.15,1)] ${
        isFocused
          ? "w-[680px] border-[#3A3A3A]"
          : "w-[520px] border-[var(--border)]"
      } ${className}`}
    >
      <LogoOrb size="small" onClick={onOrbClick} className="mr-3 shrink-0" />
      
      <form onSubmit={handleSubmit} className="flex-1 flex items-center h-full">
        <input
          type="text"
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="Ask anything..."
          className="flex-1 bg-transparent border-none outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)] font-mono text-[14px] leading-[1.7]"
        />
        <SendButton
          active={value.trim().length > 0}
          className="ml-2 shrink-0"
        />
      </form>
    </div>
  );
}
