import { z } from "zod";

export const deleteAccountReasons = [
  "I'm not using RouteBuddy anymore",
  "I have concerns about my privacy / data",
  "I have a duplicate or other account",
  "The service didn't meet my expectations",
  "Other reason",
] as const;

export const deleteAccountSchema = z.object({
  reason: z.string().optional(),
  feedback: z.string().max(300, "Feedback must be 300 characters or less").optional(),
  confirmation: z
    .string()
    .trim()
    .refine((val) => val === "DELETE", {
      message: "Please type DELETE in all uppercase to confirm",
    }),
});

export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
