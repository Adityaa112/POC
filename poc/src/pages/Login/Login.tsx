import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { isAxiosError } from "axios";
import leftPanelArtwork from "@/assets/left-panel-artwork.svg";
import rightTopLogo from "@/assets/right-top-logo.svg";
import {
  authenticateBlockedUserOtp,
  loginUser,
  preAuthHandshake,
  validateOtp,
} from "@/api/auth.api";
import PasswordField from "@/pages/components/PasswordField";
import { loginOtpSchema, type LoginOtpFormValues } from "@/pages/schema/login.otpSchema";
import { loginSchema, type LoginFormValues } from "@/pages/schema/login.schema";
import InputField from "@/shared/components/InputField";
import { useAuthStore } from "@/store/useAuthStore";

type LoginLocationState = {
  successMessage?: string;
};

export default function Login() {
  const [step, setStep] = useState<"login" | "otp">("login");
  const [loading, setLoading] = useState(false);
  const [blockedLoading, setBlockedLoading] = useState(false);
  const [showBlockedPopup, setShowBlockedPopup] = useState(false);
  const [blockedMessage, setBlockedMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const otpInputRef = useRef<HTMLInputElement>(null);

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
  const blockedOtpForm = useForm<LoginOtpFormValues>({
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

  useEffect(() => {
    const nextSuccessMessage = location.state?.successMessage;
    if (!nextSuccessMessage) return;

    setSuccessMessage(nextSuccessMessage);
    setStep("login");
    otpForm.reset({ username: "", otp: "" });
    loginForm.setValue("password", "");
    blockedOtpForm.reset({ username: "", otp: "" });
    setShowBlockedPopup(false);
    setBlockedMessage("");
    setErrorMessage("");
    navigate(location.pathname, { replace: true, state: null });
  }, [blockedOtpForm, location.pathname, location.state, loginForm, navigate, otpForm]);

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

  const otpDigits = Array.from({ length: 4 }, (_, index) => otpValue[index] ?? "");

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
          blockedOtpForm.reset({ username: values.username, otp: "" });
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

  const handleBlockedOtpSubmit = async (values: LoginOtpFormValues) => {
    try {
      setBlockedLoading(true);
      setBlockedMessage("");
      setErrorMessage("");
      await authenticateBlockedUserOtp(values.username, Number(values.otp));
      setShowBlockedPopup(false);
      blockedOtpForm.reset({ username: "", otp: "" });
      loginForm.setValue("username", values.username, { shouldDirty: true });
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
        setBlockedMessage(apiMessage || "Failed to unblock user. Try again.");
        return;
      }
      setBlockedMessage("Failed to unblock user. Try again.");
    } finally {
      setBlockedLoading(false);
    }
  };

  return (
    <div className="flex h-dvh w-full items-center justify-center overflow-hidden bg-[#f4f5f7] p-3 sm:p-5">
      <div className="mx-auto flex h-full w-full max-w-275 overflow-hidden rounded-[22px] bg-white shadow-[0_18px_70px_rgba(15,23,42,0.08)]">
        <section className="relative hidden w-[47%] flex-col overflow-hidden rounded-[22px] bg-[#0f62fe] text-white lg:flex">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1.5px, transparent 1.5px), 
                                linear-gradient(90deg, rgba(255,255,255,0.08) 1.5px, transparent 1.5px)`,
              backgroundSize: "14px 14px",
              maskImage: "radial-gradient(circle at center, black 40%, transparent 90%)",
              WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 90%)",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.15),transparent_40%),linear-gradient(180deg,rgba(0,0,0,0.1)_0%,transparent_100%)]" />

          <div className="relative z-10 flex h-full flex-col items-center justify-between px-10 py-12 text-center">
            <div className="pt-12">
              <h1 className="text-[26px] font-medium leading-[1.35] text-white xl:text-[28px]">
                Take Charge <br />
                of Your <span className="font-bold">Investments with Us</span>
              </h1>
              <p className="mt-4 text-sm text-blue-100 opacity-70 italic">
                "Secure your future with Nest"
              </p>
            </div>

            <div className="flex flex-1 items-center justify-center">
              <img
                src={leftPanelArtwork}
                alt="Investment illustration"
                className="h-auto w-full max-w-55"
              />
            </div>

            <div className="flex items-center gap-2 pb-2">
              <span className="h-1.5 w-5 rounded-full bg-[#7b6330]" />
              <span className="h-2 w-2 rounded-full bg-white/40" />
              <span className="h-2 w-2 rounded-full bg-white/20" />
            </div>
          </div>
        </section>

        <section className="flex flex-1 items-center justify-center px-7 py-10 sm:px-12 lg:px-16">
          <div className="w-full max-w-90">
            <div className="mb-8">
              <div className="mb-6 flex justify-start">
                <img src={rightTopLogo} alt="Logo" className="h-12 w-auto" />
              </div>
              <h2 className="text-[15px] font-semibold text-[#2f2f2f]">Welcome to Nest app</h2>
            </div>

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
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-[#2f2f2f]">Enter OTP</p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      OTP Sent to {loginForm.getValues("username") || "your account"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => otpInputRef.current?.focus()}
                    className="flex w-full items-center justify-between gap-3 text-left"
                  >
                    {otpDigits.map((digit, index) => (
                      <span
                        key={index}
                        className={[
                          "flex h-12 w-12 items-center justify-center rounded-md border text-lg font-semibold transition",
                          digit
                            ? "border-[#0f62fe] bg-[#f8fbff] text-[#2f2f2f]"
                            : "border-slate-100 bg-white text-slate-300",
                        ].join(" ")}
                      >
                        {digit || "*"}
                      </span>
                    ))}
                  </button>

                  <input
                    ref={otpInputRef}
                    type="text"
                    value={otpValue}
                    onChange={(e) => handleOtpChange(e.target.value)}
                    inputMode="numeric"
                    maxLength={4}
                    className="sr-only"
                  />
                  {otpForm.formState.errors.otp?.message && (
                    <p className="text-xs text-red-500">{otpForm.formState.errors.otp.message}</p>
                  )}
                </div>
              )}
            </form>

            {(errorMessage || successMessage) && (
              <div
                className={`mt-5 rounded-xl border px-4 py-3 text-sm ${
                  errorMessage
                    ? "border-red-200 bg-red-50 text-red-600"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
              >
                {errorMessage || successMessage}
              </div>
            )}

            <div className="mt-8 flex gap-3">
              {step === "otp" && (
                <button
                  type="button"
                  onClick={() => {
                    setStep("login");
                    otpForm.reset({ username: "", otp: "" });
                    setErrorMessage("");
                  }}
                  className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Back
                </button>
              )}

              <button
                type="submit"
                form="login-form"
                disabled={loading || (step === "otp" && otpValue.length !== 4)}
                className="flex-1 rounded-lg bg-[#0f62fe] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0b57df] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
              >
                {loading
                  ? step === "login"
                    ? "Signing in..."
                    : "Verifying..."
                  : step === "login"
                    ? "Login"
                    : "Verify OTP"}
              </button>
            </div>
            {step === "login" && (
              <div className="mt-4 flex justify-start">
                <button
                  type="button"
                  onClick={() => navigate("/forget-user-id")}
                  className="text-sm font-semibold text-[#0f62fe] transition hover:text-[#0b57df]"
                >
                  Forgot user ID or password?
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
      {showBlockedPopup && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4">
          <div className="w-full max-w-[420px] rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-900">User Blocked</h3>
            <p className="mt-2 text-sm text-slate-600">
              {blockedMessage || "User is blocked due to maximum login attempts. Enter OTP to unblock."}
            </p>

            <form className="mt-5 space-y-4" onSubmit={blockedOtpForm.handleSubmit(handleBlockedOtpSubmit)}>
              <InputField
                label="Username"
                placeholder="Enter username"
                autoComplete="username"
                error={blockedOtpForm.formState.errors.username?.message}
                {...blockedOtpForm.register("username")}
              />
              <InputField
                label="OTP"
                placeholder="Enter 4-digit OTP"
                inputMode="numeric"
                maxLength={4}
                error={blockedOtpForm.formState.errors.otp?.message}
                {...blockedOtpForm.register("otp")}
              />

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowBlockedPopup(false);
                    blockedOtpForm.reset({ username: "", otp: "" });
                  }}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={blockedLoading}
                  className="flex-1 rounded-lg bg-[#0f62fe] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b57df] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                >
                  {blockedLoading ? "Unblocking..." : "Unblock User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
