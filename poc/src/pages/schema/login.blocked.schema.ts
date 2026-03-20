import { z } from "zod";

export const blockedUnblockSchema = z.object({
  username: z.string().trim().min(1, "Username is required."),
  panNumber: z
    .string()
    .trim()
    .min(1, "PAN number is required.")
    .transform((value) => value.toUpperCase())
    .refine(
      (value) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value),
      "Enter a valid PAN number."
    ),
});

export const blockedAuthenticateOtpSchema = z.object({
  otp: z
    .string()
    .trim()
    .min(1, "OTP is required.")
    .regex(/^\d{4}$/, "OTP must be exactly 4 digits."),
});

export type BlockedUnblockFormValues = z.infer<typeof blockedUnblockSchema>;
export type BlockedAuthenticateOtpFormValues = z.infer<
  typeof blockedAuthenticateOtpSchema
>;
