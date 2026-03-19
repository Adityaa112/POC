type AuthModeTabsProps = {
  activeTab: "forgotPassword" | "forgotUserId";
  onForgotPassword: () => void;
  onForgotUserId: () => void;
};

export default function AuthModeTabs({
  activeTab,
  onForgotPassword,
  onForgotUserId,
}: AuthModeTabsProps) {
  return (
    <div className="mb-1 flex border-b border-slate-200 text-sm font-semibold">
      <button
        type="button"
        onClick={onForgotPassword}
        className={[
          "px-4 py-2",
          activeTab === "forgotPassword"
            ? "border-b-2 border-[#0f62fe] text-[#0f62fe]"
            : "text-slate-500",
        ].join(" ")}
      >
        Forgot Password
      </button>
      <button
        type="button"
        onClick={onForgotUserId}
        className={[
          "px-4 py-2",
          activeTab === "forgotUserId"
            ? "border-b-2 border-[#0f62fe] text-[#0f62fe]"
            : "text-slate-500",
        ].join(" ")}
      >
        Forgot User ID
      </button>
    </div>
  );
}
