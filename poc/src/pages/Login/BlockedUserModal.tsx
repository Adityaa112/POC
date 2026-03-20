import type { UseFormReturn } from "react-hook-form";
import type {
  BlockedAuthenticateOtpFormValues,
  BlockedUnblockFormValues,
} from "@/pages/schema/login.blocked.schema";
import Button from "@/shared/components/Button";
import InputField from "@/shared/components/InputField";
import OtpInput from "@/shared/components/OtpInput";

type BlockedUserModalProps = {
  show: boolean;
  blockedMessage: string;
  blockedStep: "unblock" | "otp";
  blockedUsername: string;
  blockedLoading: boolean;
  blockedOtpValue: string;
  blockedUnblockForm: UseFormReturn<BlockedUnblockFormValues>;
  blockedOtpForm: UseFormReturn<BlockedAuthenticateOtpFormValues>;
  onSubmitUnblock: (values: BlockedUnblockFormValues) => Promise<void>;
  onSubmitBlockedOtp: (values: BlockedAuthenticateOtpFormValues) => Promise<void>;
  onCancel: () => void;
  onBackToUnblock: () => void;
  onBlockedOtpChange: (value: string) => void;
};

export default function BlockedUserModal({
  show,
  blockedMessage,
  blockedStep,
  blockedUsername,
  blockedLoading,
  blockedOtpValue,
  blockedUnblockForm,
  blockedOtpForm,
  onSubmitUnblock,
  onSubmitBlockedOtp,
  onCancel,
  onBackToUnblock,
  onBlockedOtpChange,
}: BlockedUserModalProps) {
  if (!show) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4">
      <div className="w-full max-w-105 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-slate-900">User Blocked</h3>
        <p className="mt-2 text-sm text-slate-600">
          {blockedMessage ||
            (blockedStep === "unblock"
              ? "User is blocked due to maximum login attempts. Enter username and PAN."
              : "Enter OTP to complete user unblock.")}
        </p>

        {blockedStep === "unblock" ? (
          <form
            className="mt-5 space-y-4"
            onSubmit={blockedUnblockForm.handleSubmit(onSubmitUnblock)}
          >
            <InputField
              label="Username"
              placeholder="Enter username"
              autoComplete="username"
              error={blockedUnblockForm.formState.errors.username?.message}
              {...blockedUnblockForm.register("username")}
            />
            <InputField
              label="PAN Number"
              placeholder="Enter PAN number"
              autoComplete="off"
              maxLength={10}
              error={blockedUnblockForm.formState.errors.panNumber?.message}
              {...blockedUnblockForm.register("panNumber", {
                onChange: (event) => {
                  event.target.value = event.target.value.toUpperCase();
                },
              })}
            />

            <div className="flex gap-3 pt-1">
              <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="flex-1"
                loading={blockedLoading}
                loadingText="Verifying..."
              >
                Continue
              </Button>
            </div>
          </form>
        ) : (
          <form
            className="mt-5 space-y-4"
            onSubmit={blockedOtpForm.handleSubmit(onSubmitBlockedOtp)}
          >
            <InputField label="Username" value={blockedUsername} disabled readOnly />
            <OtpInput
              value={blockedOtpValue}
              onChange={onBlockedOtpChange}
              error={blockedOtpForm.formState.errors.otp?.message}
              title="OTP"
              subtitle="Enter 4-digit OTP to unblock user"
              boxClassName="h-10 w-10 text-sm"
            />

            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onBackToUnblock}
              >
                Back
              </Button>
              <Button
                type="submit"
                size="sm"
                className="flex-1"
                loading={blockedLoading}
                loadingText="Unblocking..."
              >
                Unblock User
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
