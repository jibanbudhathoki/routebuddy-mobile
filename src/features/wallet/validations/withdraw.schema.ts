import { z } from "zod";

export const withdrawSchema = z.object({
  email: z
    .string()
    .min(1, "Destination email is required")
    .email("Please enter a valid destination email address"),
  amount: z
    .number()
    .positive("Amount must be greater than $0.00"),
});

export type WithdrawFormValues = z.infer<typeof withdrawSchema>;
