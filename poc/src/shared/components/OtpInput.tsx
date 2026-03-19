import { useRef } from "react";

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  digits?: number;
  title?: string;
  subtitle?: string;
  resendText?: string;
  onResend?: () => void;
  resendDisabled?: boolean;
  placeholderChar?: string;
  boxClassName?: string;
};

export default function OtpInput({
  value,
  onChange,
  error,
  digits = 4,
  title,
  subtitle,
  resendText = "Resend OTP",
  onResend,
  resendDisabled = false,
  placeholderChar = "*",
  boxClassName = "h-12 w-12 text-lg",
}: OtpInputProps) {
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const otpDigits = Array.from({ length: digits }, (_, index) => value[index] ?? "");

  return (
    <div className="space-y-4">
      {title || subtitle ? (
        <div>
          {title ? <p className="text-sm font-semibold text-[#2f2f2f]">{title}</p> : null}
          {subtitle ? <p className="mt-1 text-[11px] text-slate-400">{subtitle}</p> : null}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => hiddenInputRef.current?.focus()}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        {otpDigits.map((digit, index) => (
          <span
            key={index}
            className={[
              "flex items-center justify-center rounded-md border font-semibold transition",
              digit
                ? "border-[#0f62fe] bg-[#f8fbff] text-[#2f2f2f]"
                : "border-slate-100 bg-white text-slate-300",
              boxClassName,
            ].join(" ")}
          >
            {digit || placeholderChar}
          </span>
        ))}
      </button>

      <input
        ref={hiddenInputRef}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        inputMode="numeric"
        maxLength={digits}
        className="sr-only"
      />

      {onResend ? (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onResend}
            disabled={resendDisabled}
            className="text-xs font-semibold text-[#0f62fe] transition hover:text-[#0b57df] disabled:cursor-not-allowed disabled:text-slate-400"
          >
            {resendText}
          </button>
        </div>
      ) : null}

      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
