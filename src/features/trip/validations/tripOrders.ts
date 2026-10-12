import { z } from "zod";

const tripOrderSchema = z.object({
  uid: z.string().min(1),
  neededBy: z.string().datetime(),
  latestDeliveryBy: z.string().datetime(),
  status: z.string().min(1),
  totalCost: z.union([z.string(), z.number()]).transform(String),
  deliveryCity: z.string(),
  origin: z.string(),
  destination: z.string(),
  stores: z.array(z.string()),
  requester: z.object({
    name: z.string(),
    photoUrl: z.string().url().nullable(),
  }),
  driver: z
    .object({
      name: z.string(),
      photoUrl: z.string().url().nullable(),
    })
    .nullable(),
});

const tripOrdersPayloadSchema = z.object({
  success: z.boolean().optional(),
  message: z.string().optional(),
  data: z.array(tripOrderSchema),
  total: z.number().int().nonnegative().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  meta: z
    .object({
      total: z.number().int().nonnegative(),
      page: z.number().int().positive(),
      limit: z.number().int().positive(),
    })
    .optional(),
});

export const listTripOrdersResponseSchema = tripOrdersPayloadSchema.transform(
  (response) => ({
    success: response.success ?? true,
    message: response.message ?? "Orders retrieved successfully.",
    data: response.data,
    total: response.total ?? response.meta?.total ?? response.data.length,
    page: response.page ?? response.meta?.page ?? 1,
    limit: response.limit ?? response.meta?.limit ?? Math.max(response.data.length, 1),
  }),
);
