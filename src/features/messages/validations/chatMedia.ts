import { z } from "zod";

const uploadResponseFields = {
  success: z.boolean().optional(),
  message: z.string().optional(),
  mediaUrl: z.string().url().nullable().optional(),
  photoUrl: z.string().url().nullable().optional(),
  mediaType: z.string().optional(),
};

const canonicalUploadPayloadSchema = z
  .object({
    ...uploadResponseFields,
    mediaKey: z.string().min(1),
    photoKey: z.string().optional(),
  })
  .transform(({ photoKey, photoUrl, ...payload }) => ({
    ...payload,
    mediaUrl: payload.mediaUrl ?? photoUrl,
  }));

const photoKeyUploadPayloadSchema = z
  .object({
    ...uploadResponseFields,
    photoKey: z.string().min(1),
    mediaKey: z.string().optional(),
  })
  .transform(({ mediaKey, photoKey, mediaUrl, photoUrl, ...payload }) => ({
    ...payload,
    mediaKey: mediaKey ?? photoKey,
    mediaUrl: mediaUrl ?? photoUrl,
  }));

const uploadPayloadSchema = z.union([
  canonicalUploadPayloadSchema,
  photoKeyUploadPayloadSchema,
]);

export const chatMediaUploadResponseSchema = z.union([
  uploadPayloadSchema,
  z.object({ data: uploadPayloadSchema }).transform(({ data }) => data),
]);
