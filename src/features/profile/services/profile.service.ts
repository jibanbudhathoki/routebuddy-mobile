import { apiEndpoints } from "../../../constant/url";
import { apiRequest } from "../../../shared/api/apiClient";
import {
  profileApiResponseSchema,
  profilePhotoUploadDataSchema,
  profilePhotoUploadEnvelopeSchema,
  profilePhotoUploadPayloadSchema,
  updateUserProfilePayloadSchema,
  userProfileSchema,
} from "../validations/profile";
import type {
  ProfilePhotoFile,
  ProfilePhotoUploadResponse,
  UpdateUserProfilePayload,
  UserProfile,
} from "../types/profile";

export type {
  ProfilePhotoFile,
  ProfilePhotoUploadResponse,
  UpdateUserProfilePayload,
  UserProfile,
} from "../types/profile";

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    const response = await apiRequest<unknown>(apiEndpoints.profile.base, {
      method: "GET",
    });
    return parseProfileResponse(response);
  },

  async updateProfile(
    data: UpdateUserProfilePayload,
  ): Promise<UserProfile> {
    const payload = updateUserProfilePayloadSchema.parse(data);
    const response = await apiRequest<unknown>(apiEndpoints.profile.base, {
      method: "PUT",
      body: payload,
    });
    return parseProfileResponse(response);
  },

  async uploadProfilePhoto(
    file: ProfilePhotoFile,
  ): Promise<ProfilePhotoUploadResponse> {
    const formData = new FormData();
    formData.append(
      "file",
      {
        uri: file.uri,
        name: file.fileName,
        type: file.mimeType,
      } as unknown as Blob,
    );

    const response = await apiRequest<unknown>(
      `${apiEndpoints.media.upload}?folder=profiles`,
      {
        method: "POST",
        body: formData,
        timeoutMs: 120_000,
      },
    );
    const directResponse =
      profilePhotoUploadPayloadSchema.safeParse(response);
    if (directResponse.success) return directResponse.data;

    const envelopeResponse = profilePhotoUploadEnvelopeSchema.parse(response);
    if (!envelopeResponse.success) {
      throw new Error(
        envelopeResponse.message || "The profile photo upload failed.",
      );
    }
    const uploadData = profilePhotoUploadDataSchema.parse(
      envelopeResponse.data,
    );
    return {
      ...uploadData,
      message: envelopeResponse.message,
    };
  },
};

function parseProfileResponse(response: unknown): UserProfile {
  const parsedResponse = profileApiResponseSchema.parse(response);
  if (!parsedResponse.success) {
    throw new Error(parsedResponse.message || "The profile request failed.");
  }
  return userProfileSchema.parse(parsedResponse.data);
}
