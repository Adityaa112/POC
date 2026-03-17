import { z } from "zod";

export const loginOtpSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Username is required."),
  otp: z
    .string()
    .trim()
    .min(1, "OTP is required.")
    .regex(/^\d{4}$/, "OTP must be exactly 4 digits."),
});

export type LoginOtpFormValues = z.infer<typeof loginOtpSchema>;
