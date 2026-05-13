import { LogoOrb } from "../ui/LogoOrb";
import { SendButton } from "../ui/SendButton";

interface InputPillProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
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
      onSubmit(e);
    }
  };

  return (
    <div
      className={`flex items-center h-[72px] bg-[#1a1a1a] border border-[#333333] px-4 transition-all duration-300 ease-[cubic-bezier(0.32,0,0.15,1)] ${
        isFocused ? "w-[680px] border-[#444444]" : "w-[560px]"
      } ${className}`}
    >
      <LogoOrb size="small" onClick={onOrbClick} className="mr-4 shrink-0" />
      
      <form onSubmit={handleSubmit} className="flex-1 flex items-center h-full gap-4">
        <div className="flex-1 bg-[#262626] h-[44px] flex items-center px-4">
          <input
            type="text"
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder="Ask anything..."
            className="flex-1 bg-transparent border-none outline-none text-[#999999] placeholder-[#555555] font-sans text-[16px]"
          />
        </div>
        <SendButton
          active={value.trim().length > 0}
          className="shrink-0"
        />
      </form>
    </div>
  );
}
