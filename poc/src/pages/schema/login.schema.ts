import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Username is required.")
    .min(3, "Username must be at least 3 characters.")
    .max(50, "Username must be 50 characters or less."),
  password: z
    .string()
    .min(1, "Password is required.")
    .min(8, "Password must be at least 8 characters.")
    .max(100, "Password must be 100 characters or less.")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/,
      "Password must include uppercase, lowercase, number, and special character."
    ),
});



export type LoginFormValues = z.infer<typeof loginSchema>;
