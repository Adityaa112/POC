import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { isAxiosError } from "axios";
import rightTopLogo from "@/assets/right-top-logo.svg";
import {
  authenticateOtp,
  forgotPassword,
  setPassword,
} from "@/api/auth.api";
import PasswordField from "@/pages/components/PasswordField";
import {
  forgotPasswordOtpSchema,
  forgotPasswordRequestSchema,
  forgotPasswordSetSchema,
  type ForgotPasswordOtpFormValues,
  type ForgotPasswordRequestFormValues,
  type ForgotPasswordSetFormValues,
} from "@/pages/schema/forgotCredentials.schema";
import AuthModeTabs from "@/shared/components/AuthModeTabs";
import Button from "@/shared/components/Button";
import InputField from "@/shared/components/InputField";
import OtpInput from "@/shared/components/OtpInput";
import PasswordRules from "@/shared/components/PasswordRules";
import StatusMessage from "@/shared/components/StatusMessage";
import AuthLayout from "@/shared/layouts/AuthLayout";

type ForgotPasswordStep = "request" | "otp" | "setPassword";

export default function ForgetPassword() {
  const [step, setStep] = useState<ForgotPasswordStep>("request");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [recoveryUsername, setRecoveryUsername] = useState("");
  const [recoveryPanNumber, setRecoveryPanNumber] = useState("");
  const navigate = useNavigate();

  const requestForm = useForm<ForgotPasswordRequestFormValues>({
    resolver: zodResolver(forgotPasswordRequestSchema),
    defaultValues: {
      username: "",
      panNumber: "",
    },
  });

  const otpForm = useForm<ForgotPasswordOtpFormValues>({
    resolver: zodResolver(forgotPasswordOtpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const setPasswordForm = useForm<ForgotPasswordSetFormValues>({
    resolver: zodResolver(forgotPasswordSetSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const otpValue = otpForm.watch("otp") ?? "";
  const passwordValue = setPasswordForm.watch("password") ?? "";

  const hasMinLength = passwordValue.length >= 10;
  const hasDigit = /\d/.test(passwordValue);
  const hasSpecial = /[^A-Za-z\d]/.test(passwordValue);
  const isWeakPassword = passwordValue.length > 0 && !(hasMinLength && hasDigit && hasSpecial);
  const isCompactStep = step !== "request";

  const handleRequestSubmit = async (values: ForgotPasswordRequestFormValues) => {
    try {
      setLoading(true);
      setErrorMessage("");
      await forgotPassword(values.username, values.panNumber);
      setRecoveryUsername(values.username);
      setRecoveryPanNumber(values.panNumber);
      otpForm.reset({ otp: "" });
      setStep("otp");
    } catch (error) {
      console.error(error);
      setErrorMessage("Forgot password request failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (values: ForgotPasswordOtpFormValues) => {
    try {
      setLoading(true);
      setErrorMessage("");
      await authenticateOtp(recoveryUsername, Number(values.otp));
      setStep("setPassword");
    } catch (error) {
      console.error(error);
      setErrorMessage("OTP verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSetPasswordSubmit = async (values: ForgotPasswordSetFormValues) => {
    try {
      setLoading(true);
      setErrorMessage("");
      await setPassword(recoveryUsername, values.password);
      navigate("/login", {
        replace: true,
        state: {
          successMessage: "New password has been successfully updated",
        },
      });
    } catch (error) {
      if (isAxiosError(error)) {
        const apiMessage = String(
          error.response?.data?.errors?.[0]?.errorMessage ??
          error.response?.data?.message ??
          ""
        );
        setErrorMessage(apiMessage || "Set password failed. Try again.");
      } else {
        setErrorMessage("Set password failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!recoveryUsername || !recoveryPanNumber || loading) return;
    try {
      setLoading(true);
      setErrorMessage("");
      await forgotPassword(recoveryUsername, recoveryPanNumber);
    } catch (error) {
      console.error(error);
      setErrorMessage("Could not resend OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 4);
    otpForm.setValue("otp", cleaned, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <AuthLayout
      title="Nest app"
      contentClassName={isCompactStep ? "max-w-[300px]" : "max-w-90"}
      customHeader={
        isCompactStep ? (
          <div className="mb-8 flex items-center gap-2">
            <img src={rightTopLogo} alt="Nest App logo" className="h-11 w-10.5" />
            <h2 className="text-[15px] font-semibold text-[#2f2f2f]">
              {step === "otp" ? "Forgot your password !" : "Set password"}
            </h2>
          </div>
        ) : (
          <div className="mb-10">
            <div className="mb-4 flex justify-start">
              <img src={rightTopLogo} alt="Nest App logo" className="h-12 w-11.5" />
            </div>
            <h2 className="text-[15px] font-semibold text-[#2f2f2f]">Nest app</h2>
          </div>
        )
      }
    >

      {step === "request" && (
        <form className="space-y-5" onSubmit={requestForm.handleSubmit(handleRequestSubmit)}>
          <AuthModeTabs
            activeTab="forgotPassword"
            onForgotPassword={() => navigate("/forget-password")}
            onForgotUserId={() => navigate("/forget-user-id")}
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

                <Button
                  type="button"
                  variant="text"
                  fullWidth
                  onClick={() => navigate("/login")}
                >
                  Go back
                </Button>
        </form>
      )}

      {step === "otp" && (
        <form className="space-y-4" onSubmit={otpForm.handleSubmit(handleOtpSubmit)}>
          <OtpInput
            value={otpValue}
            onChange={handleOtpChange}
            title="Enter OTP"
            subtitle="OTP sent to your registered contact"
            onResend={handleResendOtp}
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
      )}

      {step === "setPassword" && (
        <form className="space-y-5" onSubmit={setPasswordForm.handleSubmit(handleSetPasswordSubmit)}>
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
      )}
    </AuthLayout>
  );
}
