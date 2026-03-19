import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { forgotUserId } from "@/api/auth.api";
import {
  forgotUserIdSchema,
  type ForgotCredentialsFormValues,
} from "@/pages/schema/forgotCredentials.schema";
import AuthModeTabs from "@/shared/components/AuthModeTabs";
import Button from "@/shared/components/Button";
import InputField from "@/shared/components/InputField";
import StatusMessage from "@/shared/components/StatusMessage";
import AuthLayout from "@/shared/layouts/AuthLayout";

export default function ForgetUserId() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const form = useForm<ForgotCredentialsFormValues>({
    resolver: zodResolver(forgotUserIdSchema),
    defaultValues: {
      emailId: "",
      panNumber: "",
    },
  });

  const handleSubmit = async (values: ForgotCredentialsFormValues) => {
    try {
      setLoading(true);
      setErrorMessage("");

      await forgotUserId(values.panNumber, values.emailId);

      navigate("/login", {
        replace: true,
        state: {
          successMessage: "User ID has been sent to your register email.",
        },
      });
    } catch (error) {
      console.error(error);
      setErrorMessage("Recovery request failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Nest app" headerClassName="mb-10">
      <form className="mt-8 space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
        <AuthModeTabs
          activeTab="forgotUserId"
          onForgotPassword={() => navigate("/forget-password")}
          onForgotUserId={() => navigate("/forget-user-id")}
        />

              <InputField
                label="Mobile / Email"
                placeholder="Enter mobile / user ID"
                autoComplete="username"
                error={form.formState.errors.emailId?.message}
                {...form.register("emailId", {
                  onChange: () => form.clearErrors("emailId"),
                })}
              />

              <InputField
                label="PAN"
                placeholder="Enter PAN"
                autoComplete="off"
                maxLength={10}
                error={form.formState.errors.panNumber?.message}
                {...form.register("panNumber", {
                  onChange: (event) => {
                    event.target.value = event.target.value.toUpperCase();
                    form.clearErrors("panNumber");
                  },
                })}
              />

              <StatusMessage message={errorMessage} tone="error" />

              <Button type="submit" fullWidth loading={loading} loadingText="Submitting...">
                Proceed
              </Button>

              <Button
                type="button"
                variant="text"
                fullWidth
                onClick={() => navigate("/login")}
              >
                Go back
              </Button>
      </form>
    </AuthLayout>
  );
}
