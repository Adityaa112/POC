import OtpInput from "@/shared/components/OtpInput";

type LoginOtpFormProps = {
  otpValue: string;
  error?: string;
  username: string;
  onOtpChange: (value: string) => void;
};

export default function LoginOtpForm({
  otpValue,
  error,
  username,
  onOtpChange,
}: LoginOtpFormProps) {
  return (
    <OtpInput
      value={otpValue}
      onChange={onOtpChange}
      title="Enter OTP"
      subtitle={`OTP Sent to ${username || "your account"}`}
      error={error}
    />
  );
}
