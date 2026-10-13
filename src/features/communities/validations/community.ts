import { z } from "zod";

import type {
  Community,
  CommunitySubmission,
  CommunityType,
  SubmitCommunityPayload,
} from "../types/community";

const communityTypeSchema = z.enum(["town", "rural", "city"]);

const communityLocationSchema = z.object({
  uid: z.string().min(1),
  name: z.string(),
});

export const communitySchema: z.ZodType<Community> = z.object({
  uid: z.string().min(1),
  slug: z.string(),
  name: z.string(),
  type: communityTypeSchema,
  status: z.enum(["approved", "pending"]),
  city: communityLocationSchema.nullable().optional(),
  province: communityLocationSchema.nullable().optional(),
});

export const communityPageResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(communitySchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export const communityTypesSchema: z.ZodType<CommunityType[]> = z.array(
  communityTypeSchema,
);

export const communityTypesEnvelopeSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.unknown(),
});

export const submitCommunityPayloadSchema: z.ZodType<SubmitCommunityPayload> =
  z.object({
    name: z.string().trim().min(2).max(100),
    provinceUid: z.string().trim().min(1),
    cityUid: z.string().trim().min(1),
    description: z.string().trim().max(120).optional(),
    type: communityTypeSchema.optional(),
  });

export const communitySubmissionSchema: z.ZodType<CommunitySubmission> =
  z.object({
    uid: z.string().min(1),
    slug: z.string(),
    name: z.string(),
    status: z.literal("pending"),
    type: communityTypeSchema,
  });

export const communitySubmissionEnvelopeSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.unknown(),
});

export const joinCommunityResponseSchema = z.object({
  message: z.string(),
});
