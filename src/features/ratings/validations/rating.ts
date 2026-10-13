import { z } from "zod";

export const rateDriverPayloadSchema = z.object({
  score: z.number().int().min(1).max(5),
  comment: z.string().trim().max(500).optional(),
});

export const rateDriverResponseSchema = z.object({
  message: z.string().min(1),
});
