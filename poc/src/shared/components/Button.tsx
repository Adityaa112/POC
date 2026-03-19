import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "text";
type ButtonSize = "md" | "sm";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  loadingText?: string;
  children: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[#0f62fe] text-white hover:bg-[#0b57df] disabled:bg-slate-200 disabled:text-slate-500",
  secondary:
    "border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:border-slate-200 disabled:text-slate-400",
  text: "text-[#0f62fe] hover:text-[#0b57df] disabled:text-slate-400",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "px-5 py-3 text-sm font-semibold",
  sm: "px-4 py-2.5 text-sm font-semibold",
};

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  loadingText,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={[
        "rounded-lg transition disabled:cursor-not-allowed",
        variantClasses[variant],
        variant === "text" ? "text-sm font-semibold" : sizeClasses[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {loading ? loadingText ?? children : children}
    </button>
  );
}
