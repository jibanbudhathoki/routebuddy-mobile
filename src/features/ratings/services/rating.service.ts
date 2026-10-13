import { apiEndpoints } from "../../../constant/url";
import { apiRequest } from "../../../shared/api/apiClient";
import {
  rateDriverPayloadSchema,
  rateDriverResponseSchema,
} from "../validations/rating";
import type {
  RateDriverPayload,
  RateDriverResponse,
} from "../types/rating";

export const ratingService = {
  async rateDriver(
    requestUid: string,
    payload: RateDriverPayload,
  ): Promise<RateDriverResponse> {
    if (!requestUid.trim()) {
      throw new Error("A request ID is required to rate the driver.");
    }

    const body = rateDriverPayloadSchema.parse(payload);
    const response = await apiRequest<unknown>(
      apiEndpoints.requests.rateDriver.replace(
        ":uid",
        encodeURIComponent(requestUid),
      ),
      {
        method: "POST",
        body,
      },
    );
    return rateDriverResponseSchema.parse(response);
  },
};
