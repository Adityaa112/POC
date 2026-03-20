import type { UseFormReturn } from "react-hook-form";
import PasswordField from "@/pages/components/PasswordField";
import type { ForgotPasswordSetFormValues } from "@/pages/schema/forgotCredentials.schema";
import Button from "@/shared/components/Button";
import PasswordRules from "@/shared/components/PasswordRules";
import StatusMessage from "@/shared/components/StatusMessage";

type ForgotPasswordSetFormProps = {
  errorMessage: string;
  isWeakPassword: boolean;
  loading: boolean;
  passwordValue: string;
  setPasswordForm: UseFormReturn<ForgotPasswordSetFormValues>;
  onSubmit: (values: ForgotPasswordSetFormValues) => Promise<void>;
};

export default function ForgotPasswordSetForm({
  errorMessage,
  isWeakPassword,
  loading,
  passwordValue,
  setPasswordForm,
  onSubmit,
}: ForgotPasswordSetFormProps) {
  return (
    <form className="space-y-5" onSubmit={setPasswordForm.handleSubmit(onSubmit)}>
      <PasswordField
        label="Password"
        placeholder="Enter new password"
        error={setPasswordForm.formState.errors.password?.message}
        {...setPasswordForm.register("password")}
      />
      {isWeakPassword && (
        <p className="-mt-3 text-xs font-semibold text-amber-500">Weak password</p>
      )}

      <PasswordField
        label="Re-enter password"
        placeholder="Re-enter password"
        error={setPasswordForm.formState.errors.confirmPassword?.message}
        {...setPasswordForm.register("confirmPassword")}
      />

      <PasswordRules password={passwordValue} />

      <StatusMessage message={errorMessage} tone="error" />

      <Button
        type="submit"
        fullWidth
        disabled={!setPasswordForm.formState.isValid}
        loading={loading}
        loadingText="Setting..."
      >
        Set password
      </Button>
    </form>
  );
}
