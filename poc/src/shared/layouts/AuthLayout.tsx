import type { ReactNode } from "react";
import leftPanelArtwork from "@/assets/left-panel-artwork.svg";
import rightTopLogo from "@/assets/right-top-logo.svg";

type AuthLayoutProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  contentClassName?: string;
  headerClassName?: string;
  customHeader?: ReactNode;
};

export default function AuthLayout({
  title,
  subtitle,
  children,
  contentClassName = "max-w-90",
  headerClassName = "mb-8",
  customHeader,
}: AuthLayoutProps) {
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
              maskImage:
                "radial-gradient(circle at center, black 40%, transparent 90%)",
              WebkitMaskImage:
                "radial-gradient(circle at center, black 40%, transparent 90%)",
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
              <span className="h-2 w-2 rounded-full bg-white" />
              <span className="h-2 w-2 rounded-full bg-white/75" />
            </div>
          </div>
        </section>

        <section className="flex flex-1 items-center justify-center px-7 py-10 sm:px-12 lg:px-16">
          <div className={`w-full ${contentClassName}`}>
            {customHeader ? (
              customHeader
            ) : (
              <div className={headerClassName}>
                <div className="mb-6 flex justify-start">
                  <img src={rightTopLogo} alt="Nest App logo" className="h-12 w-auto" />
                </div>
                <h2 className="text-[15px] font-semibold text-[#2f2f2f]">{title}</h2>
                {subtitle ? (
                  <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
                ) : null}
              </div>
            )}

            {children}
          </div>
        </section>
      </div>
    </div>
  );
}
