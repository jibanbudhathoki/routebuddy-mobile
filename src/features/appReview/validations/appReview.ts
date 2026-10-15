import { z } from "zod";

export const submitAppReviewPayloadSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).optional(),
  platform: z.enum(["ios", "android", "web"]).optional(),
  appVersion: z.string().min(1).optional(),
});

export const appReviewSchema = z.object({
  uid: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().nullable().optional(),
  platform: z.enum(["ios", "android", "web"]).nullable().optional(),
  appVersion: z.string().nullable().optional(),
  createdAt: z.string().min(1),
});
