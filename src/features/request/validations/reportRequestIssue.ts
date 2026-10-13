import { z } from "zod";

export const reportRequestIssueSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Describe the issue before submitting.")
    .max(1000, "Issue description must be 1000 characters or fewer."),
});

export const reportRequestIssueResponseSchema = z.object({
  message: z.string().min(1),
});
