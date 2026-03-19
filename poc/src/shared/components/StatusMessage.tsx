type StatusMessageTone = "error" | "success";

type StatusMessageProps = {
  message?: string;
  tone?: StatusMessageTone;
  className?: string;
};

const toneClasses: Record<StatusMessageTone, string> = {
  error: "border-red-200 bg-red-50 text-red-600",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export default function StatusMessage({
  message,
  tone = "error",
  className = "",
}: StatusMessageProps) {
  if (!message) return null;

  return (
    <div
      className={[
        "rounded-xl border px-4 py-3 text-sm",
        toneClasses[tone],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {message}
    </div>
  );
}
