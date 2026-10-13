import { z } from "zod";

const myTripSchema = z.object({
  uid: z.string().min(1),
  departureAt: z.string().min(1),
  availableSeats: z.number(),
  capacity: z.number(),
  price: z.union([z.string(), z.number()]).nullable().transform((price) =>
    price == null ? null : String(price),
  ),
  status: z.string().min(1),
  origin: z.string(),
  destination: z.string(),
  driver: z.object({
    name: z.string(),
    photoUrl: z.string().nullable().optional(),
  }),
});

export const myTripsResponseSchema = z.object({
  success: z.boolean().optional(),
  message: z.string().optional(),
  data: z.array(myTripSchema),
  total: z.number().int().nonnegative().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
});
