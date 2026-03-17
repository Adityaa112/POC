import { useState } from "react";
import type { InputHTMLAttributes } from "react";
import InputField from "@/shared/components/InputField";

type PasswordFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
  error?: string;
  wrapperClassName?: string;
};

export default function PasswordField({
  label = "Password",
  error,
  wrapperClassName,
  className = "",
  ...props
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={["relative", wrapperClassName].filter(Boolean).join(" ")}>
      <InputField
        label={label}
        type={showPassword ? "text" : "password"}
        error={error}
        className={`pr-20 ${className}`.trim()}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword((current) => !current)}
        className="absolute right-4 top-[42px] text-sm font-semibold text-blue-600 transition hover:text-blue-700"
      >
        {showPassword ? "Hide" : "Show"}
      </button>
    </div>
  );
}
