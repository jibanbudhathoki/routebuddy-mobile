import { z } from "zod";

import type {
  Address,
  AddressMutationResponse,
} from "../types/address";

const addressLocationSchema = z.object({
  uid: z.string(),
  name: z.string(),
});

const addressObjectSchema = z.object({
  uid: z.string().min(1),
  label: z.string(),
  recipientName: z.string(),
  line1: z.string(),
  line2: z.string().nullable().optional(),
  cityUid: z.string(),
  provinceUid: z.string(),
  postalCode: z.string(),
  countryUid: z.string(),
  city: addressLocationSchema.nullable().optional(),
  province: addressLocationSchema.nullable().optional(),
  country: addressLocationSchema.nullable().optional(),
  phone: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  isDefault: z.boolean(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const addressSchema: z.ZodType<Address> = addressObjectSchema;

export const createAddressSchema = z.object({
  label: z.string().trim().min(1).max(50),
  recipientName: z.string().trim().min(1).max(100),
  line1: z.string().trim().min(1).max(200),
  line2: z.string().max(100).nullable().optional(),
  cityUid: z.string().min(1).max(100),
  provinceUid: z.string().min(1).max(100),
  postalCode: z.string().trim().min(3).max(20),
  countryUid: z.string().min(2).max(100),
  phone: z.string().max(20).nullable().optional(),
  notes: z.string().max(150).nullable().optional(),
  isDefault: z.boolean().optional(),
});

export const updateAddressSchema = createAddressSchema.partial();

export const addressListSchema = z.array(
  addressObjectSchema.extend({ createdAt: z.string() }),
);

export const addressListResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: addressListSchema,
});

const addressMutationObjectSchema: z.ZodType<AddressMutationResponse> =
  z.object({
    uid: z.string().min(1),
    label: z.string().optional(),
    recipientName: z.string().optional(),
    line1: z.string().optional(),
    line2: z.string().nullable().optional(),
    cityUid: z.string().optional(),
    provinceUid: z.string().optional(),
    postalCode: z.string().optional(),
    countryUid: z.string().optional(),
    phone: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
    isDefault: z.boolean().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  });

const addressEnvelopeSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    data: dataSchema,
  });

export const addressCreateResponseSchema = z
  .union([addressSchema, addressEnvelopeSchema(addressSchema)])
  .transform((response) => {
    if ("success" in response) {
      if (!response.success) {
        throw new Error(response.message || "Unable to save address.");
      }
      return response.data;
    }
    return response;
  });

export const addressMutationResponseSchema = z
  .union([
    addressMutationObjectSchema,
    addressEnvelopeSchema(addressMutationObjectSchema),
  ])
  .transform((response) => {
    if ("success" in response) {
      if (!response.success) {
        throw new Error(response.message || "Unable to update address.");
      }
      return response.data;
    }
    return response;
  });

export const addressDeleteResponseSchema = z.object({
  message: z.string(),
});
