import { useEffect } from "react";
import useBlockedUserFlow from "@/pages/Login/useBlockedUserFlow";
import useLoginFlow from "@/pages/Login/useLoginFlow";
import type { BlockedAuthenticateOtpFormValues } from "@/pages/schema/login.blocked.schema";

export default function useLoginController() {
  const blockedFlow = useBlockedUserFlow({});

  const loginFlow = useLoginFlow({
    onBlockedDetected: (username, message) => {
      blockedFlow.openBlockedPopup(username, message);
    },
  });

  const { location } = loginFlow;

  useEffect(() => {
    const hasLocationSuccess = loginFlow.applyLocationSuccessMessage();
    if (!hasLocationSuccess) return;
    blockedFlow.resetBlockedFlow();
  }, [location.pathname, location.state]);

  const handleBlockedOtpSubmit = (values: BlockedAuthenticateOtpFormValues) =>
    blockedFlow.handleBlockedOtpSubmit(values, loginFlow.applyUnblockedSuccess);

  return {
    blockedLoading: blockedFlow.blockedLoading,
    blockedMessage: blockedFlow.blockedMessage,
    blockedOtpForm: blockedFlow.blockedOtpForm,
    blockedOtpValue: blockedFlow.blockedOtpValue,
    blockedStep: blockedFlow.blockedStep,
    blockedUnblockForm: blockedFlow.blockedUnblockForm,
    blockedUsername: blockedFlow.blockedUsername,
    errorMessage: loginFlow.errorMessage,
    handleBackToLogin: loginFlow.handleBackToLogin,
    handleBlockedOtpChange: blockedFlow.handleBlockedOtpChange,
    handleBlockedOtpSubmit,
    handleBlockedUnblockSubmit: blockedFlow.handleBlockedUnblockSubmit,
    handleOtpChange: loginFlow.handleOtpChange,
    handleSubmit: loginFlow.handleSubmit,
    loading: loginFlow.loading,
    loginForm: loginFlow.loginForm,
    navigateToForgetPassword: loginFlow.navigateToForgetPassword,
    otpForm: loginFlow.otpForm,
    otpValue: loginFlow.otpValue,
    showBlockedPopup: blockedFlow.showBlockedPopup,
    step: loginFlow.step,
    successMessage: loginFlow.successMessage,
    backToBlockedUnblockStep: blockedFlow.backToBlockedUnblockStep,
    closeBlockedPopup: blockedFlow.closeBlockedPopup,
  };
}
