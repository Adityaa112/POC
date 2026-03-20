import { useState } from "react";
import { isAxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  authenticateBlockedUserOtp,
  unblockUser,
} from "@/api/auth.api";
import {
  blockedAuthenticateOtpSchema,
  blockedUnblockSchema,
  type BlockedAuthenticateOtpFormValues,
  type BlockedUnblockFormValues,
} from "@/pages/schema/login.blocked.schema";

type UseBlockedUserFlowOptions = {
  onGlobalErrorClear?: () => void;
};

export default function useBlockedUserFlow({
  onGlobalErrorClear,
}: UseBlockedUserFlowOptions) {
  const [blockedLoading, setBlockedLoading] = useState(false);
  const [showBlockedPopup, setShowBlockedPopup] = useState(false);
  const [blockedStep, setBlockedStep] = useState<"unblock" | "otp">("unblock");
  const [blockedUsername, setBlockedUsername] = useState("");
  const [blockedMessage, setBlockedMessage] = useState("");

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

  const blockedOtpValue = blockedOtpForm.watch("otp") ?? "";

  const openBlockedPopup = (username: string, message: string) => {
    setBlockedMessage(message || "User is blocked due to maximum login attempts.");
    setBlockedStep("unblock");
    setBlockedUsername(username);
    blockedUnblockForm.reset({ username, panNumber: "" });
    blockedOtpForm.reset({ otp: "" });
    setShowBlockedPopup(true);
    onGlobalErrorClear?.();
  };

  const handleBlockedOtpChange = (value: string) => {
    blockedOtpForm.setValue("otp", value.replace(/\D/g, "").slice(0, 4), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleBlockedUnblockSubmit = async (values: BlockedUnblockFormValues) => {
    try {
      setBlockedLoading(true);
      setBlockedMessage("");
      onGlobalErrorClear?.();
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
    values: BlockedAuthenticateOtpFormValues,
    onUnblocked: (username: string) => void
  ) => {
    try {
      setBlockedLoading(true);
      setBlockedMessage("");
      onGlobalErrorClear?.();
      await authenticateBlockedUserOtp(blockedUsername, Number(values.otp));
      setShowBlockedPopup(false);
      setBlockedStep("unblock");
      blockedUnblockForm.reset({ username: "", panNumber: "" });
      blockedOtpForm.reset({ otp: "" });
      onUnblocked(blockedUsername);
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

  const closeBlockedPopup = () => {
    setShowBlockedPopup(false);
    setBlockedStep("unblock");
    setBlockedUsername("");
    blockedUnblockForm.reset({ username: "", panNumber: "" });
    blockedOtpForm.reset({ otp: "" });
  };

  const backToBlockedUnblockStep = () => {
    setBlockedStep("unblock");
    blockedOtpForm.reset({ otp: "" });
  };

  const resetBlockedFlow = () => {
    setShowBlockedPopup(false);
    setBlockedStep("unblock");
    setBlockedUsername("");
    setBlockedMessage("");
    blockedUnblockForm.reset({ username: "", panNumber: "" });
    blockedOtpForm.reset({ otp: "" });
  };

  return {
    blockedLoading,
    blockedMessage,
    blockedOtpForm,
    blockedOtpValue,
    blockedStep,
    blockedUnblockForm,
    blockedUsername,
    showBlockedPopup,
    backToBlockedUnblockStep,
    closeBlockedPopup,
    handleBlockedOtpChange,
    handleBlockedOtpSubmit,
    handleBlockedUnblockSubmit,
    openBlockedPopup,
    resetBlockedFlow,
  };
}
