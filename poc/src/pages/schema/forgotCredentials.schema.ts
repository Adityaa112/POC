import { z } from "zod";

export const forgotUserIdSchema = z.object({
  panNumber: z
    .string()
    .trim()
    .min(1, "PAN number is required.")
    .transform((value) => value.toUpperCase())
    .refine(
      (value) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value),
      "Enter a valid PAN number."
    ),
  emailId: z
    .string()
    .trim()
    .min(1, "Mobile / email / user ID is required."),
});

export const forgotCredentialsSchema = forgotUserIdSchema;

export const forgotPasswordRequestSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Client ID is required."),
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

export const forgotPasswordOtpSchema = z.object({
  otp: z
    .string()
    .trim()
    .min(1, "OTP is required.")
    .regex(/^\d{4}$/, "OTP must be exactly 4 digits."),
});

export const forgotPasswordSetSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required.")
      .min(8, "Password must be at least 8 characters.")
      .max(100, "Password must be 100 characters or less.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/,
        "Password must include uppercase, lowercase, number, and special character."
      ),
    confirmPassword: z
      .string()
      .min(1, "Re-enter password is required."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password does not match",
  });

export type ForgotCredentialsFormValues = z.infer<
  typeof forgotUserIdSchema
>;
export type ForgotPasswordRequestFormValues = z.infer<
  typeof forgotPasswordRequestSchema
>;
export type ForgotPasswordOtpFormValues = z.infer<
  typeof forgotPasswordOtpSchema
>;
export type ForgotPasswordSetFormValues = z.infer<
  typeof forgotPasswordSetSchema
>;
