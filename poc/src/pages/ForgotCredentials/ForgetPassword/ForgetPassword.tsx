import rightTopLogo from "@/assets/right-top-logo.svg";
import ForgotPasswordOtpForm from "@/pages/ForgotCredentials/ForgetPassword/ForgotPasswordOtpForm";
import ForgotPasswordRequestForm from "@/pages/ForgotCredentials/ForgetPassword/ForgotPasswordRequestForm";
import ForgotPasswordSetForm from "@/pages/ForgotCredentials/ForgetPassword/ForgotPasswordSetForm";
import useForgetPasswordFlow from "@/pages/ForgotCredentials/ForgetPassword/useForgetPasswordFlow";
import AuthLayout from "@/shared/layouts/AuthLayout";

export default function ForgetPassword() {
  const {
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
    navigateToForgetPassword,
    navigateToForgetUserId,
    navigateToLogin,
  } = useForgetPasswordFlow();

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
        <ForgotPasswordRequestForm
          errorMessage={errorMessage}
          loading={loading}
          requestForm={requestForm}
          onSubmit={handleRequestSubmit}
          onNavigateToForgotPassword={navigateToForgetPassword}
          onNavigateToForgotUserId={navigateToForgetUserId}
          onNavigateToLogin={navigateToLogin}
        />
      )}

      {step === "otp" && (
        <ForgotPasswordOtpForm
          errorMessage={errorMessage}
          loading={loading}
          otpForm={otpForm}
          otpValue={otpValue}
          onOtpChange={handleOtpChange}
          onResendOtp={handleResendOtp}
          onSubmit={handleOtpSubmit}
        />
      )}

      {step === "setPassword" && (
        <ForgotPasswordSetForm
          errorMessage={errorMessage}
          isWeakPassword={isWeakPassword}
          loading={loading}
          passwordValue={passwordValue}
          setPasswordForm={setPasswordForm}
          onSubmit={handleSetPasswordSubmit}
        />
      )}
    </AuthLayout>
  );
}
