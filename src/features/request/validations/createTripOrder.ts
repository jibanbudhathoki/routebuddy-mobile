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

const addressLocationSchema = z.object({
  city: z.object({ uid: z.string(), name: z.string() }),
  province: z.object({ uid: z.string(), name: z.string() }),
  country: z.object({ uid: z.string(), name: z.string() }),
});

const tripOrderSchema = z.object({
  uid: z.string().min(1),
  kind: z.literal("order"),
  deliveryAddress: z.string(),
  neededBy: z.string(),
  latestDeliveryBy: z.string(),
  notes: z.string(),
  itemSubtotal: z.string(),
  serviceFee: z.string(),
  driverFee: z.string(),
  platformFee: z.string(),
  tax: z.string(),
  total: z.string(),
  paymentIntentId: z.string().nullable(),
  captureBefore: z.string().nullable(),
  deliveryProof: z
    .union([
      z.object({
        receiptUrl: z.string().nullable().optional(),
        itemPhotoUrls: z.array(z.string()).optional(),
        note: z.string().nullable().optional(),
      }),
      z.string(),
    ])
    .nullable(),
  issue: z.string().nullable(),
  rating: z.number().nullable(),
  status: z.enum(["pending", "open"]),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
  items: z.array(
    z.object({
      item: z.string(),
      description: z.string(),
      estimatePrice: z.string(),
    }),
  ),
  stores: z.array(
    z.object({
      uid: z.string(),
      name: z.string(),
      location: addressLocationSchema,
    }),
  ),
  requester: z.object({
    uid: z.string(),
    fName: z.string(),
    photoUrl: z.string().nullable(),
    photoKey: z.string().nullable(),
  }),
  deliveryLocation: addressLocationSchema,
  driver: z
    .object({
      uid: z.string(),
      fName: z.string(),
      photoUrl: z.string().nullable(),
      photoKey: z.string().nullable(),
    })
    .nullable(),
  trip: z
    .object({
      uid: z.string(),
      origin: z.string(),
      destination: z.string(),
    })
    .nullable(),
  offers: z.array(z.unknown()),
});

export const createTripOrderResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: tripOrderSchema.optional(),
});
