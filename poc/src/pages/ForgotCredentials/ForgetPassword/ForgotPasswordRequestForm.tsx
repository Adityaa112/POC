import type { UseFormReturn } from "react-hook-form";
import type { ForgotPasswordRequestFormValues } from "@/pages/schema/forgotCredentials.schema";
import AuthModeTabs from "@/shared/components/AuthModeTabs";
import Button from "@/shared/components/Button";
import InputField from "@/shared/components/InputField";
import StatusMessage from "@/shared/components/StatusMessage";

type ForgotPasswordRequestFormProps = {
  errorMessage: string;
  loading: boolean;
  requestForm: UseFormReturn<ForgotPasswordRequestFormValues>;
  onSubmit: (values: ForgotPasswordRequestFormValues) => Promise<void>;
  onNavigateToForgotPassword: () => void;
  onNavigateToForgotUserId: () => void;
  onNavigateToLogin: () => void;
};

export default function ForgotPasswordRequestForm({
  errorMessage,
  loading,
  requestForm,
  onSubmit,
  onNavigateToForgotPassword,
  onNavigateToForgotUserId,
  onNavigateToLogin,
}: ForgotPasswordRequestFormProps) {
  return (
    <form className="space-y-5" onSubmit={requestForm.handleSubmit(onSubmit)}>
      <AuthModeTabs
        activeTab="forgotPassword"
        onForgotPassword={onNavigateToForgotPassword}
        onForgotUserId={onNavigateToForgotUserId}
      />

      <InputField
        label="Client ID"
        placeholder="Enter user ID"
        autoComplete="username"
        error={requestForm.formState.errors.username?.message}
        {...requestForm.register("username")}
      />

      <InputField
        label="PAN"
        placeholder="Enter PAN"
        autoComplete="off"
        maxLength={10}
        error={requestForm.formState.errors.panNumber?.message}
        {...requestForm.register("panNumber", {
          onChange: (event) => {
            event.target.value = event.target.value.toUpperCase();
          },
        })}
      />

      <StatusMessage message={errorMessage} tone="error" />

      <Button type="submit" fullWidth loading={loading} loadingText="Submitting...">
        Proceed
      </Button>

      <Button type="button" variant="text" fullWidth onClick={onNavigateToLogin}>
        Go back
      </Button>
    </form>
  );
}
