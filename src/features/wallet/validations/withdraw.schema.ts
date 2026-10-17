import { z } from "zod";

export const withdrawSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export type WithdrawFormValues = z.infer<typeof withdrawSchema>;
