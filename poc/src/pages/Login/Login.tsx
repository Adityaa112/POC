import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { isAxiosError } from "axios";
import { z } from "zod";
import {
  authenticateBlockedUserOtp,
  loginUser,
  preAuthHandshake,
  unblockUser,
  validateOtp,
} from "@/api/auth.api";
import PasswordField from "@/pages/components/PasswordField";
import { loginOtpSchema, type LoginOtpFormValues } from "@/pages/schema/login.otpSchema";
import { loginSchema, type LoginFormValues } from "@/pages/schema/login.schema";
import Button from "@/shared/components/Button";
import InputField from "@/shared/components/InputField";
import OtpInput from "@/shared/components/OtpInput";
import StatusMessage from "@/shared/components/StatusMessage";
import AuthLayout from "@/shared/layouts/AuthLayout";
import { useAuthStore } from "@/store/useAuthStore";

type LoginLocationState = {
  successMessage?: string;
};

const blockedUnblockSchema = z.object({
  username: z.string().trim().min(1, "Username is required."),
  panNumber: z
    .string()
    .trim()
    .min(1, "PAN number is required.")
    .transform((value) => value.toUpperCase())
    .refine(
      (value) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value),
      "Enter a valid PAN number."
    ),
});

const blockedAuthenticateOtpSchema = z.object({
  otp: z
    .string()
    .trim()
    .min(1, "OTP is required.")
    .regex(/^\d{4}$/, "OTP must be exactly 4 digits."),
});

type BlockedUnblockFormValues = z.infer<typeof blockedUnblockSchema>;
type BlockedAuthenticateOtpFormValues = z.infer<typeof blockedAuthenticateOtpSchema>;

export default function Login() {
  const [step, setStep] = useState<"login" | "otp">("login");
  const [loading, setLoading] = useState(false);
  const [blockedLoading, setBlockedLoading] = useState(false);
  const [showBlockedPopup, setShowBlockedPopup] = useState(false);
  const [blockedStep, setBlockedStep] = useState<"unblock" | "otp">("unblock");
  const [blockedUsername, setBlockedUsername] = useState("");
  const [blockedMessage, setBlockedMessage] = useState("");
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
  const blockedUnblockForm = useForm<BlockedUnblockFormValues>({
    resolver: zodResolver(blockedUnblockSchema),
    defaultValues: {
      username: "",
      panNumber: "",
    },
  });
  const blockedOtpForm = useForm<BlockedAuthenticateOtpFormValues>({
    resolver: zodResolver(blockedAuthenticateOtpSchema),
    defaultValues: {
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

  useEffect(() => {
    const nextSuccessMessage = location.state?.successMessage;
    if (!nextSuccessMessage) return;

    setSuccessMessage(nextSuccessMessage);
    setStep("login");
    otpForm.reset({ username: "", otp: "" });
    loginForm.setValue("password", "");
    blockedUnblockForm.reset({ username: "", panNumber: "" });
    blockedOtpForm.reset({ otp: "" });
    setShowBlockedPopup(false);
    setBlockedStep("unblock");
    setBlockedUsername("");
    setBlockedMessage("");
    setErrorMessage("");
    navigate(location.pathname, { replace: true, state: null });
  }, [
    blockedOtpForm,
    blockedUnblockForm,
    location.pathname,
    location.state,
    loginForm,
    navigate,
    otpForm,
  ]);

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

  const blockedOtpValue = blockedOtpForm.watch("otp") ?? "";

  const handleLoginSubmit = async (values: LoginFormValues) => {
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      setBlockedMessage("");
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
          setBlockedMessage(apiMessage || "User is blocked due to maximum login attempts.");
          setBlockedStep("unblock");
          setBlockedUsername(values.username);
          blockedUnblockForm.reset({ username: values.username, panNumber: "" });
          blockedOtpForm.reset({ otp: "" });
          setShowBlockedPopup(true);
          setErrorMessage("");
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    if (step === "login") {
      void loginForm.handleSubmit(handleLoginSubmit)();
      return;
    }

    void otpForm.handleSubmit(handleOtpSubmit)();
  };

  const handleBlockedUnblockSubmit = async (values: BlockedUnblockFormValues) => {
    try {
      setBlockedLoading(true);
      setBlockedMessage("");
      setErrorMessage("");
      await unblockUser(values.username, values.panNumber);
      setBlockedUsername(values.username);
      blockedOtpForm.reset({ otp: "" });
      setBlockedStep("otp");
      setBlockedMessage("Verification successful. Enter OTP to complete unblock.");
    } catch (err) {
      if (isAxiosError(err)) {
        const apiMessage = String(
          err.response?.data?.errors?.[0]?.errorMessage ??
          err.response?.data?.message ??
          ""
        );
        setBlockedMessage(apiMessage || "Failed to unblock user. Try again.");
        return;
      }
      setBlockedMessage("Failed to unblock user. Try again.");
    } finally {
      setBlockedLoading(false);
    }
  };

  const handleBlockedOtpSubmit = async (
    values: BlockedAuthenticateOtpFormValues
  ) => {
    try {
      setBlockedLoading(true);
      setBlockedMessage("");
      setErrorMessage("");
      await authenticateBlockedUserOtp(blockedUsername, Number(values.otp));
      setShowBlockedPopup(false);
      setBlockedStep("unblock");
      blockedUnblockForm.reset({ username: "", panNumber: "" });
      blockedOtpForm.reset({ otp: "" });
      loginForm.setValue("username", blockedUsername, { shouldDirty: true });
      loginForm.setValue("password", "");
      setSuccessMessage("User unblocked successfully. Please login again.");
      setStep("login");
    } catch (err) {
      if (isAxiosError(err)) {
        const apiMessage = String(
          err.response?.data?.errors?.[0]?.errorMessage ??
          err.response?.data?.message ??
          ""
        );
        setBlockedMessage(apiMessage || "Failed to verify OTP. Try again.");
        return;
      }
      setBlockedMessage("Failed to verify OTP. Try again.");
    } finally {
      setBlockedLoading(false);
    }
  };

  return (
    <>
      <AuthLayout title="Welcome to Nest app">
        <form id="login-form" className="space-y-5" onSubmit={handleSubmit}>
              {step === "login" ? (
                <>
                  <InputField
                    label="Mobile no. / Email / Client ID"
                    placeholder="Enter your username"
                    autoComplete="username"
                    error={loginForm.formState.errors.username?.message}
                    {...loginForm.register("username", {
                      onChange: () => loginForm.clearErrors("username"),
                    })}
                  />
                  <PasswordField
                    label="Password / MPIN"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    error={loginForm.formState.errors.password?.message}
                    {...loginForm.register("password", {
                      onChange: () => loginForm.clearErrors("password"),
                    })}
                  />
                </>
              ) : (
                <OtpInput
                  value={otpValue}
                  onChange={handleOtpChange}
                  title="Enter OTP"
                  subtitle={`OTP Sent to ${loginForm.getValues("username") || "your account"}`}
                  error={otpForm.formState.errors.otp?.message}
                />
              )}
        </form>

        {errorMessage ? (
          <StatusMessage message={errorMessage} tone="error" className="mt-5" />
        ) : null}
        {!errorMessage && successMessage ? (
          <StatusMessage message={successMessage} tone="success" className="mt-5" />
        ) : null}

        <div className="mt-8 flex gap-3">
          {step === "otp" && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setStep("login");
                otpForm.reset({ username: "", otp: "" });
                setErrorMessage("");
              }}
            >
              Back
            </Button>
          )}

          <Button
            type="submit"
            form="login-form"
            className="flex-1"
            disabled={step === "otp" && otpValue.length !== 4}
            loading={loading}
            loadingText={step === "login" ? "Signing in..." : "Verifying..."}
          >
            {step === "login" ? "Login" : "Verify OTP"}
          </Button>
        </div>
        {step === "login" && (
          <div className="mt-4 flex justify-start">
            <button
              type="button"
              onClick={() => navigate("/forget-password")}
              className="text-sm font-semibold text-[#0f62fe] transition hover:text-[#0b57df]"
            >
              Forgot user ID or password?
            </button>
          </div>
        )}
      </AuthLayout>
      {showBlockedPopup ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4">
          <div className="w-full max-w-[420px] rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
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
                onSubmit={blockedUnblockForm.handleSubmit(handleBlockedUnblockSubmit)}
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
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setShowBlockedPopup(false);
                      setBlockedStep("unblock");
                      setBlockedUsername("");
                      blockedUnblockForm.reset({ username: "", panNumber: "" });
                      blockedOtpForm.reset({ otp: "" });
                    }}
                  >
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
                onSubmit={blockedOtpForm.handleSubmit(handleBlockedOtpSubmit)}
              >
                <InputField
                  label="Username"
                  value={blockedUsername}
                  disabled
                  readOnly
                />
                <OtpInput
                  value={blockedOtpValue}
                  onChange={(value) =>
                    blockedOtpForm.setValue("otp", value.replace(/\D/g, "").slice(0, 4), {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
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
                    onClick={() => {
                      setBlockedStep("unblock");
                      blockedOtpForm.reset({ otp: "" });
                    }}
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
      ) : null}
    </>
  );
}
