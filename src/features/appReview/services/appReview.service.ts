import Constants from "expo-constants";
import { Platform } from "react-native";

import { apiEndpoints } from "../../../constant/url";
import { apiRequest } from "../../../shared/api/apiClient";
import type {
  AppReview,
  AppReviewPlatform,
  SubmitAppReviewPayload,
} from "../types/appReview";
import {
  appReviewSchema,
  submitAppReviewPayloadSchema,
} from "../validations/appReview";

export const appReviewService = {
  async submit(payload: SubmitAppReviewPayload): Promise<AppReview> {
    const platform = getReviewPlatform();
    const appVersion = Constants.expoConfig?.version;
    const body = submitAppReviewPayloadSchema.parse({
      ...payload,
      ...(platform ? { platform } : {}),
      ...(appVersion ? { appVersion } : {}),
    });
    const response = await apiRequest<unknown>(
      apiEndpoints.appReview.submitReview,
      {
        method: "POST",
        body,
      },
    );
    return appReviewSchema.parse(response);
  },
};

function getReviewPlatform(): AppReviewPlatform | undefined {
  if (
    Platform.OS === "ios" ||
    Platform.OS === "android" ||
    Platform.OS === "web"
  ) {
    return Platform.OS;
  }
  return undefined;
}
