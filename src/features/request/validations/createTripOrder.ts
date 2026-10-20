import { z } from "zod";

export const createTripOrderSchema = z.object({
  tripUid: z.string().min(1, "Trip is required."),
  stores: z.array(z.string().min(1)).min(1, "This trip has no available stores."),
  items: z
    .array(
      z.object({
        item: z.string().trim().min(1, "Each item needs a name."),
        description: z.string(),
        estimatePrice: z.number().finite().nonnegative(),
      }),
    )
    .min(1, "Add at least one item to your shopping list."),
  deliveryAddress: z.string().min(1, "Choose a delivery address."),
  notes: z.string(),
});

const tripOrderCreationDataSchema = z.object({
  postId: z.string().min(1),
  status: z.enum(["pending", "open"]),
  totalItems: z.number().int().nonnegative(),
  totalCost: z
    .union([
      z.string().regex(/^\d+(\.\d+)?$/),
      z.number().finite().nonnegative(),
    ])
    .transform(String),
});

export const createTripOrderResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: tripOrderCreationDataSchema,
});
