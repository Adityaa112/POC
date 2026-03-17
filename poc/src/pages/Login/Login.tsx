import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import leftPanelArtwork from "@/assets/left-panel-artwork.svg";
import rightTopLogo from "@/assets/right-top-logo.svg";
import {
  forgotUserId,
  preAuthHandshake,
  loginUser,
  validateOtp,
} from "@/api/auth.api";
import PasswordField from "@/pages/components/PasswordField";
import { loginOtpSchema } from "@/pages/schema/login.otpSchema";
import { loginSchema } from "@/pages/schema/login.schema";
import InputField from "@/shared/components/InputField";
import { useAuthStore } from "@/store/useAuthStore";

type FormErrors = {
  username?: string;
  password?: string;
  otp?: string;
};

export default function Login() {
  const [step, setStep] = useState<"login" | "otp">("login");
  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const otpInputRef = useRef<HTMLInputElement>(null);

  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    preAuthHandshake()
      .then((res) => console.log("Handshake:", res))
      .catch((err) => console.error(err));
  }, []);

  const handleOtpChange = (value: string) => {
    setOtp(value);

    if (!/^\d*$/.test(value)) {
      setErrors((current) => ({
        ...current,
        otp: "OTP must contain digits only.",
      }));
      return;
    }

    if (value.length > 4 || (value.length > 0 && value.length < 4)) {
      setErrors((current) => ({
        ...current,
        otp: "OTP must be exactly 4 digits.",
      }));
      return;
    }

    setErrors((current) => ({ ...current, otp: undefined }));
  };

  const otpDigits = Array.from({ length: 4 }, (_, index) => otp[index] ?? "");

  const handleLogin = async () => {
    const parsedValues = loginSchema.safeParse({ username, password });

    if (!parsedValues.success) {
      const fieldErrors = parsedValues.error.flatten().fieldErrors;
      setErrors({
        username: fieldErrors.username?.[0],
        password: fieldErrors.password?.[0],
      });
      setErrorMessage("Fix the highlighted fields and try again.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      setErrors({});

      const res = await loginUser(
        parsedValues.data.username,
        parsedValues.data.password
      );
      console.log("Login:", res);
      setStep("otp");
    } catch (err) {
      console.error(err);
      setErrorMessage("Login failed. Check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const parsedValues = loginOtpSchema.safeParse({ username, otp });

    if (!parsedValues.success) {
      const fieldErrors = parsedValues.error.flatten().fieldErrors;
      setErrors({
        username: fieldErrors.username?.[0],
        otp: fieldErrors.otp?.[0],
      });
      setErrorMessage("Fix the highlighted fields and try again.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      setErrors({});

      const res = await validateOtp(
        parsedValues.data.username,
        Number(parsedValues.data.otp)
      );
      console.log("OTP:", res);
      console.log("OTP response top-level keys:", Object.keys(res ?? {}));
      console.log("OTP nested data keys:", Object.keys(res?.data ?? {}));
      console.log("OTP nested result keys:", Object.keys(res?.result ?? {}));
      console.log("OTP nested payload keys:", Object.keys(res?.payload ?? {}));
      setAuth(res);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setErrorMessage("OTP verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotUserId = async () => {
    try {
      setForgotLoading(true);
      setErrorMessage("");

      const res = await forgotUserId();
      console.log("Forgot user ID:", res);
    } catch (err) {
      console.error(err);
      setErrorMessage("Forgot user ID or password request failed. Try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    if (step === "login") {
      void handleLogin();
      return;
    }

    if (otp.length === 4) {
      void handleVerifyOtp();
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f5f7] px-3 py-3 sm:px-5 sm:py-5">
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[1100px] overflow-hidden rounded-[22px] bg-white shadow-[0_18px_70px_rgba(15,23,42,0.08)]">
        <section className="relative hidden w-[47%] flex-col rounded-[22px] bg-[#0f62fe] text-white lg:flex">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_36%),linear-gradient(180deg,#2b6cf6_0%,#1157f0_100%)]" />

          <div className="relative z-10 flex h-full flex-col items-center justify-between px-10 py-12 text-center">
            <div className="pt-12">
              <h1 className="text-4xl font-medium leading-tight text-white">
                Take Charge
                <br />
                of Your <span className="font-bold">Investments with Us</span>
              </h1>
              <p className="mt-4 text-sm text-blue-100">"Dummy message"</p>
            </div>

            <div className="flex flex-1 items-center justify-center">
              <img
                src={leftPanelArtwork}
                alt="Investment illustration"
                className="h-auto w-full max-w-[220px]"
              />
            </div>

            <div className="flex items-center gap-2 pb-2">
              <span className="h-1.5 w-5 rounded-full bg-[#63552e]" />
              <span className="h-2 w-2 rounded-full bg-white" />
              <span className="h-2 w-2 rounded-full bg-white/75" />
            </div>
          </div>
        </section>

        <section className="flex flex-1 items-center justify-center px-7 py-10 sm:px-12 lg:px-16">
          <div className="w-full max-w-[360px]">
            <div className="mb-10">
              <div className="mb-4 flex justify-start">
                <img src={rightTopLogo} alt="Nest App logo" className="h-12 w-[46px]" />
              </div>
              <h2 className="text-[15px] font-semibold text-[#2f2f2f]">
                Welcome to Nest app
              </h2>
            </div>

            <form
              id="login-form"
              className="mt-8 space-y-5"
              onSubmit={handleSubmit}
            >
              {step === "login" ? (
                <>
                  <InputField
                    label="Mobile no. / Email /Client ID"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setErrors((current) => ({ ...current, username: undefined }));
                    }}
                    autoComplete="username"
                    error={errors.username}
                  />
                  <PasswordField
                    label="Password / MPIN"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((current) => ({ ...current, password: undefined }));
                    }}
                    autoComplete="current-password"
                    error={errors.password}
                  />
                </>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-[#2f2f2f]">
                      Enter OTP
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      OTP Sent on {username || "your registered account"}
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
                        {digit || "•"}
                      </span>
                    ))}
                  </button>

                  <input
                    ref={otpInputRef}
                    type="text"
                    value={otp}
                    onChange={(e) => handleOtpChange(e.target.value)}
                    inputMode="numeric"
                    maxLength={4}
                    className="sr-only"
                    aria-label="Enter OTP"
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && otp.length === 4) {
                        event.preventDefault();
                        void handleVerifyOtp();
                      }
                    }}
                  />

                  {errors.otp ? (
                    <p className="text-xs text-red-500">{errors.otp}</p>
                  ) : null}
                </div>
              )}
            </form>

            {errorMessage ? (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMessage}
              </div>
            ) : null}

            <div className="mt-8 flex gap-3">
              {step === "otp" ? (
                <button
                  type="button"
                  onClick={() => {
                    setStep("login");
                    setOtp("");
                    setErrorMessage("");
                    setErrors({});
                  }}
                  className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Back
                </button>
              ) : null}

              <button
                type="submit"
                form="login-form"


                disabled={loading || (step === "otp" && otp.length !== 4)}
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

            {step === "login" ? (
              <button
                type="button"
                onClick={handleForgotUserId}
                disabled={forgotLoading}
                className="mt-4 text-sm font-semibold text-[#0f62fe] transition hover:text-[#0b57df] disabled:cursor-not-allowed disabled:text-slate-400"
              >
                {forgotLoading
                  ? "Requesting forgot user ID..."
                  : "Forgot user ID or password?"}
              </button>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
