import type { UseFormReturn } from "react-hook-form";
import type { ForgotPasswordOtpFormValues } from "@/pages/schema/forgotCredentials.schema";
import Button from "@/shared/components/Button";
import OtpInput from "@/shared/components/OtpInput";
import StatusMessage from "@/shared/components/StatusMessage";

type ForgotPasswordOtpFormProps = {
  errorMessage: string;
  loading: boolean;
  otpForm: UseFormReturn<ForgotPasswordOtpFormValues>;
  otpValue: string;
  onOtpChange: (value: string) => void;
  onResendOtp: () => Promise<void>;
  onSubmit: (values: ForgotPasswordOtpFormValues) => Promise<void>;
};

export default function ForgotPasswordOtpForm({
  errorMessage,
  loading,
  otpForm,
  otpValue,
  onOtpChange,
  onResendOtp,
  onSubmit,
}: ForgotPasswordOtpFormProps) {
  return (
    <form className="space-y-4" onSubmit={otpForm.handleSubmit(onSubmit)}>
      <OtpInput
        value={otpValue}
        onChange={onOtpChange}
        title="Enter OTP"
        subtitle="OTP sent to your registered contact"
        onResend={onResendOtp}
        resendDisabled={loading}
        error={otpForm.formState.errors.otp?.message}
        boxClassName="h-10 w-10 text-sm"
      />

      <StatusMessage message={errorMessage} tone="error" />

      <Button
        type="submit"
        fullWidth
        disabled={otpValue.length !== 4}
        loading={loading}
        loadingText="Verifying..."
      >
        Verify
      </Button>
    </form>
  );
}
