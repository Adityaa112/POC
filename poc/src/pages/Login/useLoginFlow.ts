import { useEffect, useState, type FormEvent } from "react";
import { isAxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser, preAuthHandshake, validateOtp } from "@/api/auth.api";
import { loginOtpSchema, type LoginOtpFormValues } from "@/pages/schema/login.otpSchema";
import { loginSchema, type LoginFormValues } from "@/pages/schema/login.schema";
import { useAuthStore } from "@/store/useAuthStore";

type LoginLocationState = {
  successMessage?: string;
};

type UseLoginFlowOptions = {
  onBlockedDetected: (username: string, message: string) => void;
};

export default function useLoginFlow({ onBlockedDetected }: UseLoginFlowOptions) {
  const [step, setStep] = useState<"login" | "otp">("login");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const otpForm = useForm<LoginOtpFormValues>({
    resolver: zodResolver(loginOtpSchema),
    defaultValues: {
      username: "",
      otp: "",
    },
  });

  const otpValue = otpForm.watch("otp") ?? "";

  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation() as {
    pathname: string;
    state: LoginLocationState | null;
  };

  useEffect(() => {
    preAuthHandshake()
      .then((res) => console.log("Handshake:", res))
      .catch((err) => console.error(err));
  }, []);

  const handleOtpChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 4);
    otpForm.setValue("otp", cleaned, { shouldValidate: true, shouldDirty: true });

    if (value !== cleaned) {
      otpForm.setError("otp", { message: "OTP must contain digits only." });
      return;
    }

    if (cleaned.length > 0 && cleaned.length < 4) {
      otpForm.setError("otp", { message: "OTP must be exactly 4 digits." });
      return;
    }

    otpForm.clearErrors("otp");
  };

  const handleLoginSubmit = async (values: LoginFormValues) => {
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      await loginUser(values.username, values.password);
      otpForm.reset({ username: values.username, otp: "" });
      setStep("otp");
    } catch (err) {
      if (isAxiosError(err)) {
        const status = err.response?.status;
        const apiMessage = String(
          err.response?.data?.errors?.[0]?.errorMessage ??
            err.response?.data?.message ??
            ""
        );

        if ((status === 403 || status === 423) && /blocked/i.test(apiMessage)) {
          onBlockedDetected(values.username, apiMessage);
          return;
        }
      }
      setErrorMessage("Login failed. Check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (values: LoginOtpFormValues) => {
    try {
      setLoading(true);
      setErrorMessage("");
      const res = await validateOtp(values.username, Number(values.otp));
      setAuth(res);
      navigate("/dashboard");
    } catch (err) {
      setErrorMessage("OTP verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    if (step === "login") {
      void loginForm.handleSubmit(handleLoginSubmit)();
      return;
    }

    void otpForm.handleSubmit(handleOtpSubmit)();
  };

  const handleBackToLogin = () => {
    setStep("login");
    otpForm.reset({ username: "", otp: "" });
    setErrorMessage("");
  };

  const navigateToForgetPassword = () => navigate("/forget-password");

  const applyLocationSuccessMessage = () => {
    const nextSuccessMessage = location.state?.successMessage;
    if (!nextSuccessMessage) return false;

    setSuccessMessage(nextSuccessMessage);
    setStep("login");
    otpForm.reset({ username: "", otp: "" });
    loginForm.setValue("password", "");
    setErrorMessage("");
    navigate(location.pathname, { replace: true, state: null });
    return true;
  };

  const applyUnblockedSuccess = (username: string) => {
    loginForm.setValue("username", username, { shouldDirty: true });
    loginForm.setValue("password", "");
    setSuccessMessage("User unblocked successfully. Please login again.");
    setStep("login");
  };

  return {
    errorMessage,
    loading,
    loginForm,
    location,
    otpForm,
    otpValue,
    step,
    successMessage,
    applyLocationSuccessMessage,
    applyUnblockedSuccess,
    clearErrorMessage: () => setErrorMessage(""),
    handleBackToLogin,
    handleOtpChange,
    handleSubmit,
    navigateToForgetPassword,
  };
}
