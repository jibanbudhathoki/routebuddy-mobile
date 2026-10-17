import { z } from "zod";

export const addPaymentMethodSchema = z.object({
  holderName: z
    .string()
    .min(2, "Cardholder name must be at least 2 characters")
    .max(100, "Cardholder name is too long"),
  cardNumber: z
    .string()
    .min(15, "Card number must be 15 to 16 digits")
    .max(19, "Card number is too long")
    .regex(/^[\d\s]+$/, "Card number can only contain digits"),
  expiryMonth: z
    .string()
    .length(2, "Month must be 2 digits (MM)")
    .regex(/^(0[1-9]|1[0-2])$/, "Invalid month (01-12)"),
  expiryYear: z
    .string()
    .length(2, "Year must be 2 digits (YY)")
    .regex(/^\d{2}$/, "Invalid year format"),
  cvc: z
    .string()
    .min(3, "CVC must be 3 or 4 digits")
    .max(4, "CVC must be 3 or 4 digits")
    .regex(/^\d+$/, "CVC can only contain digits"),
  postalCode: z.string().optional(),
});

export type AddPaymentMethodFormValues = z.infer<typeof addPaymentMethodSchema>;
