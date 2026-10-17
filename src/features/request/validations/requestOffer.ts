import { z } from "zod";

export const requestOfferSchema = z.object({
  proposedLatestBy: z.iso.datetime(),
  message: z
    .string()
    .trim()
    .max(500, "Message must be 500 characters or fewer."),
});

export type RequestOfferFormData = z.infer<typeof requestOfferSchema>;

type RequestOfferValidation =
  | { isValid: true; data: RequestOfferFormData }
  | { isValid: false; error: string };

export function validateRequestOffer(
  proposedAt: Date,
  message: string,
  latestDeliveryBy: string,
  now = new Date(),
): RequestOfferValidation {
  const latestDeadline = new Date(latestDeliveryBy);
  if (
    Number.isNaN(latestDeadline.getTime()) ||
    latestDeadline.getTime() <= now.getTime()
  ) {
    return {
      isValid: false,
      error: "This request's delivery deadline has already passed.",
    };
  }

  if (Number.isNaN(proposedAt.getTime())) {
    return {
      isValid: false,
      error: "Please choose a valid delivery date and time.",
    };
  }

  const result = requestOfferSchema.safeParse({
    proposedLatestBy: proposedAt.toISOString(),
    message,
  });
  if (!result.success) {
    return {
      isValid: false,
      error: result.error.issues[0]?.message ?? "Check the offer details.",
    };
  }

  const proposedTime = new Date(result.data.proposedLatestBy).getTime();
  if (proposedTime <= now.getTime()) {
    return { isValid: false, error: "Choose a delivery time in the future." };
  }
  if (proposedTime > latestDeadline.getTime()) {
    return {
      isValid: false,
      error: "Your proposed time must be by the request's latest delivery.",
    };
  }

  return { isValid: true, data: result.data };
}
