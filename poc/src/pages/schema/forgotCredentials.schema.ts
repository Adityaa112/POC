import { z } from "zod";

export const forgotCredentialsSchema = z.object({
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

export type ForgotCredentialsFormValues = z.infer<
  typeof forgotCredentialsSchema
>;
