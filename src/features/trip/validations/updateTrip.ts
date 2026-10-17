import { z } from "zod";

export const updateTripSchema = z
  .object({
    originCityUid: z.string().min(1, "Select a starting city."),
    destinationCityUid: z.string().min(1, "Select a destination city."),
    stores: z.array(z.string()).min(1, "Select at least one store."),
    departureAt: z.string().datetime({ offset: true }),
    orderCutoffAt: z.string().datetime({ offset: true }),
    deliveryLatestBy: z.string().datetime({ offset: true }),
    capacity: z.number().int().min(1, "Orders allowed must be at least 1."),
    price: z.number().min(0).optional(),
    notes: z.string().max(500, "Notes must be 500 characters or fewer.").nullable(),
  })
  .superRefine((trip, context) => {
    const cutoff = new Date(trip.orderCutoffAt);
    const departure = new Date(trip.departureAt);
    const delivery = new Date(trip.deliveryLatestBy);

    if (cutoff > departure) {
      context.addIssue({
        code: "custom",
        path: ["orderCutoffAt"],
        message: "Order cut-off must be on or before departure.",
      });
    }
    if (departure > delivery) {
      context.addIssue({
        code: "custom",
        path: ["deliveryLatestBy"],
        message: "Latest delivery must be on or after departure.",
      });
    }
  });
