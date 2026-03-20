import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { isAxiosError } from "axios";
import { authenticateOtp, forgotPassword, setPassword } from "@/api/auth.api";
import {
  forgotPasswordOtpSchema,
  forgotPasswordRequestSchema,
  forgotPasswordSetSchema,
  type ForgotPasswordOtpFormValues,
  type ForgotPasswordRequestFormValues,
  type ForgotPasswordSetFormValues,
} from "@/pages/schema/forgotCredentials.schema";

export type ForgotPasswordStep = "request" | "otp" | "setPassword";

export default function useForgetPasswordFlow() {
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
  const isCompactStep = step !== "request";

  const hasMinLength = passwordValue.length >= 8;
  const hasDigit = /\d/.test(passwordValue);
  const hasSpecial = /[^A-Za-z\d]/.test(passwordValue);
  const isWeakPassword =
    passwordValue.length > 0 && !(hasMinLength && hasDigit && hasSpecial);

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

  return {
    errorMessage,
    isCompactStep,
    isWeakPassword,
    loading,
    otpForm,
    otpValue,
    passwordValue,
    requestForm,
    setPasswordForm,
    step,
    handleOtpChange,
    handleOtpSubmit,
    handleRequestSubmit,
    handleResendOtp,
    handleSetPasswordSubmit,
    navigateToForgetPassword: () => navigate("/forget-password"),
    navigateToForgetUserId: () => navigate("/forget-user-id"),
    navigateToLogin: () => navigate("/login"),
  };
}
