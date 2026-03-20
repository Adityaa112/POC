import BlockedUserModal from "@/pages/Login/BlockedUserModal";
import LoginCredentialsForm from "@/pages/Login/LoginCredentialsForm";
import LoginOtpForm from "@/pages/Login/LoginOtpForm";
import useLoginController from "@/pages/Login/useLoginController";
import Button from "@/shared/components/Button";
import StatusMessage from "@/shared/components/StatusMessage";
import AuthLayout from "@/shared/layouts/AuthLayout";

export default function Login() {
  const {
    blockedLoading,
    blockedMessage,
    blockedOtpForm,
    blockedOtpValue,
    blockedStep,
    blockedUnblockForm,
    blockedUsername,
    errorMessage,
    handleBackToLogin,
    handleBlockedOtpChange,
    handleBlockedOtpSubmit,
    handleBlockedUnblockSubmit,
    handleOtpChange,
    handleSubmit,
    loading,
    loginForm,
    navigateToForgetPassword,
    otpForm,
    otpValue,
    showBlockedPopup,
    step,
    successMessage,
    backToBlockedUnblockStep,
    closeBlockedPopup,
  } = useLoginController();

  return (
    <>
      <AuthLayout title="Welcome to Nest app">
        <form id="login-form" className="space-y-5" onSubmit={handleSubmit}>
          {step === "login" ? (
            <LoginCredentialsForm loginForm={loginForm} />
          ) : (
            <LoginOtpForm
              otpValue={otpValue}
              onOtpChange={handleOtpChange}
              username={loginForm.getValues("username")}
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
            <Button type="button" variant="secondary" onClick={handleBackToLogin}>
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
              onClick={navigateToForgetPassword}
              className="text-sm font-semibold text-[#0f62fe] transition hover:text-[#0b57df]"
            >
              Forgot user ID or password?
            </button>
          </div>
        )}
      </AuthLayout>

      <BlockedUserModal
        show={showBlockedPopup}
        blockedMessage={blockedMessage}
        blockedStep={blockedStep}
        blockedUsername={blockedUsername}
        blockedLoading={blockedLoading}
        blockedOtpValue={blockedOtpValue}
        blockedUnblockForm={blockedUnblockForm}
        blockedOtpForm={blockedOtpForm}
        onSubmitUnblock={handleBlockedUnblockSubmit}
        onSubmitBlockedOtp={handleBlockedOtpSubmit}
        onCancel={closeBlockedPopup}
        onBackToUnblock={backToBlockedUnblockStep}
        onBlockedOtpChange={handleBlockedOtpChange}
      />
    </>
  );
}
