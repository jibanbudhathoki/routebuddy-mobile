import { z } from "zod";

import type {
  ProfilePhotoUploadResponse,
  UpdateUserProfilePayload,
  ProfileNotificationPreferences,
  ProfileAddress,
  ProfileLocation,
  UserProfile,
} from "../types/profile";

const profileNotificationPreferencesSchema: z.ZodType<ProfileNotificationPreferences> =
  z.object({
    pushNewTripRequests: z.boolean(),
    pushNewMessages: z.boolean(),
    pushTripUpdates: z.boolean(),
    pushPaymentsEscrow: z.boolean(),
    pushCommunityAnnouncements: z.boolean(),
    emailNotifications: z.boolean(),
    notificationSound: z.boolean(),
  });

const profileAddressSchema: z.ZodType<ProfileAddress> = z.object({
  uid: z.string(),
  userUid: z.string(),
  label: z.string(),
  recipientName: z.string(),
  line1: z.string(),
  line2: z.string().nullable(),
  cityUid: z.string(),
  provinceUid: z.string(),
  countryUid: z.string(),
  postalCode: z.string(),
  phone: z.string().nullable(),
  notes: z.string().nullable(),
  isDefault: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const profileLocationSchema: z.ZodType<ProfileLocation> = z.object({
  city: z.object({ uid: z.string(), name: z.string() }).nullable(),
  province: z.object({ uid: z.string(), name: z.string() }).nullable(),
  country: z.object({ uid: z.string(), name: z.string() }).nullable(),
});

export const userProfileSchema: z.ZodType<UserProfile> = z.object({
  uid: z.string(),
  slug: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  displayName: z.string(),
  photoUrl: z.string().nullable(),
  photoKey: z.string().nullable(),
  provider: z.string().optional(),
  phone: z.string().nullable(),
  city: z.string().nullable().optional(),
  homeTown: z.string().nullable(),
  rating: z.number().min(0).max(5).nullable(),
  defaultAddressUid: z.string().nullable().optional(),
  roles: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
  stripeCustomerId: z.string().nullable().optional(),
  notificationPrefs: profileNotificationPreferencesSchema.nullable().optional(),
  communityName: z.string().nullable().optional(),
  defaultAddress: profileAddressSchema.nullable().optional(),
  location: profileLocationSchema.nullable().optional(),
});

export const profileApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.unknown(),
});

export const updateUserProfilePayloadSchema: z.ZodType<UpdateUserProfilePayload> =
  z.object({
    displayName: z.string().trim().min(1).max(100).optional(),
    photoUrl: z.string().max(500).nullable().optional(),
    photoKey: z.string().max(500).nullable().optional(),
    phone: z.string().max(20).nullable().optional(),
    city: z.string().max(100).nullable().optional(),
    homeTown: z.string().max(100).nullable().optional(),
    rating: z.number().min(0).max(5).nullable().optional(),
    defaultAddressUid: z.string().optional(),
  });

export const profilePhotoUploadDataSchema = z.object({
    mediaKey: z.string().min(1),
    mediaUrl: z.string().url(),
    photoKey: z.string().min(1),
    photoUrl: z.string().url(),
    mediaType: z.literal("image"),
  });

export const profilePhotoUploadPayloadSchema: z.ZodType<ProfilePhotoUploadResponse> =
  profilePhotoUploadDataSchema.extend({
    message: z.string(),
  });

export const profilePhotoUploadEnvelopeSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.unknown(),
});
