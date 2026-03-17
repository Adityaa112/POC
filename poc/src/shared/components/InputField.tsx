import type { InputHTMLAttributes } from "react";

type InputFieldProps = {
  label: string;
  error?: string;
  wrapperClassName?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function InputField({
  label,
  error,
  id,
  className = "",
  wrapperClassName = "",
  ...props
}: InputFieldProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={wrapperClassName}>
      <label
        htmlFor={inputId}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={[
          "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition",
          "placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100",
          error ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
      {error ? <p className="mt-2 text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
