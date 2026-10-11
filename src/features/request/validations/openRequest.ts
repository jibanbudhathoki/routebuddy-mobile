import { z } from "zod";
import type { CreateOpenRequestApiPayload } from "../types/request";

const dateTimeSchema = z.string().datetime({ offset: true });

const openRequestSchema = z
  .object({
    stores: z.array(z.string().trim().min(1)).min(1, "Please select at least one store."),
    items: z
      .array(
        z.object({
          item: z.string().trim().min(1, "Enter an item name."),
          description: z.string().max(500, "Item descriptions must be 500 characters or fewer."),
          estimatePrice: z
            .number()
            .finite("Enter a valid item price.")
            .min(0, "Item prices cannot be negative."),
        }),
      )
      .min(1, "Please add at least one item."),
    deliveryAddress: z.string().trim().min(1, "Please select a delivery address."),
    deliveryCityUid: z.string().trim().min(1, "The selected address must have a delivery city."),
    neededBy: dateTimeSchema,
    latestDeliveryBy: dateTimeSchema,
    notes: z.string().max(500, "Instructions must be 500 characters or fewer."),
  })
  .superRefine((payload, context) => {
    if (new Date(payload.latestDeliveryBy) < new Date(payload.neededBy)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["latestDeliveryBy"],
        message: "Latest delivery date must be on or after the day you need the items.",
      });
    }
  });

export type OpenRequestValidation =
  | { isValid: true; data: CreateOpenRequestApiPayload }
  | { isValid: false; error: string };

export function validateOpenRequest(
  payload: Partial<CreateOpenRequestApiPayload>,
): OpenRequestValidation {
  const result = openRequestSchema.safeParse(payload);
  if (!result.success) {
    return { isValid: false, error: result.error.issues[0]?.message ?? "Please check your request details." };
  }

  return { isValid: true, data: result.data };
}
