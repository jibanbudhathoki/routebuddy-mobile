import { z } from "zod";

export const notificationSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  message: z.string(),
  type: z.string(),
  isRead: z.boolean(),
  createdAt: z.string(),
  data: z.record(z.string(), z.unknown()).nullable().optional(),
});

export const notificationsEnvelopeSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.array(notificationSchema).optional(),
});
