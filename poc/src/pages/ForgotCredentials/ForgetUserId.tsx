import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import leftPanelArtwork from "@/assets/left-panel-artwork.svg";
import rightTopLogo from "@/assets/right-top-logo.svg";
import { forgotUserId } from "@/api/auth.api";
import {
  forgotCredentialsSchema,
  type ForgotCredentialsFormValues,
} from "@/pages/schema/forgotCredentials.schema";
import InputField from "@/shared/components/InputField";

export default function ForgetUserId() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const form = useForm<ForgotCredentialsFormValues>({
    resolver: zodResolver(forgotCredentialsSchema),
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
              <p className="mt-4 text-sm text-blue-100 opacity-70 italic">"Secure your future with Nest"</p>
            </div>

            <div className="flex flex-1 items-center justify-center">
              <img src={leftPanelArtwork} alt="Account recovery illustration" className="h-auto w-full max-w-55" />
            </div>

            <div className="flex items-center gap-2 pb-2">
              <span className="h-1.5 w-5 rounded-full bg-[#7b6330]" />
              <span className="h-2 w-2 rounded-full bg-white" />
              <span className="h-2 w-2 rounded-full bg-white/75" />
            </div>
          </div>
        </section>

        <section className="flex flex-1 items-center justify-center px-7 py-10 sm:px-12 lg:px-16">
          <div className="w-full max-w-90">
            <div className="mb-10">
              <div className="mb-4 flex justify-start">
                <img src={rightTopLogo} alt="Nest App logo" className="h-12 w-11.5" />
              </div>
              <h2 className="text-[15px] font-semibold text-[#2f2f2f]">Forgot user ID</h2>
            </div>

            <form className="mt-8 space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
              <InputField
                label="Mobile / Email / User ID"
                placeholder="Enter mobile / user ID"
                autoComplete="username"
                error={form.formState.errors.emailId?.message}
                {...form.register("emailId", {
                  onChange: () => form.clearErrors("emailId"),
                })}
              />

              <InputField
                label="PAN Number"
                placeholder="Enter your PAN number"
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

              {errorMessage ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {errorMessage}
                </div>
              ) : null}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-[#0f62fe] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0b57df] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                >
                  {loading ? "Submitting..." : "Proceed"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
