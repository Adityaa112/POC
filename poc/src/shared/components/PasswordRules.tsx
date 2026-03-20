type PasswordRulesProps = {
  password: string;
  minLength?: number;
  className?: string;
};

type RuleItem = {
  label: string;
  isValid: boolean;
};

export default function PasswordRules({
  password,
  minLength = 8,
  className = "",
}: PasswordRulesProps) {
  const rules: RuleItem[] = [
    {
      label: `Minimum ${minLength} characters`,
      isValid: password.length >= minLength,
    },
    {
      label: "Minimum 1 digit",
      isValid: /\d/.test(password),
    },
    {
      label: "Minimum 1 special character",
      isValid: /[^A-Za-z\d]/.test(password),
    },
  ];

  return (
    <div className={["space-y-1.5 text-xs text-slate-500", className].filter(Boolean).join(" ")}>
      {rules.map((rule) => (
        <p key={rule.label} className="flex items-center gap-2">
          <span
            className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border text-[9px] ${
              rule.isValid
                ? "border-emerald-600 text-emerald-600"
                : "border-slate-400 text-slate-400"
            }`}
          >
            v
          </span>
          <span className={rule.isValid ? "text-emerald-600" : "text-slate-500"}>
            {rule.label}
          </span>
        </p>
      ))}
    </div>
  );
}
