import { apiRequest } from "../../../shared/api/apiClient";
import { apiEndpoints } from "../../../constant/url";
import type {
  CreateTripOrderPayload,
  CreateTripOrderResponse,
  CreateOpenRequestApiPayload,
  CreateOpenRequestResponse,
  SubmitRequestOfferPayload,
  SubmitRequestOfferResponse,
} from "../types/request";
import { createTripOrderResponseSchema } from "../validations/createTripOrder";

export const createTripOrder = async (
  payload: CreateTripOrderPayload,
): Promise<CreateTripOrderResponse> => {
  const rawResponse = await apiRequest<unknown>(apiEndpoints.orders.postOrder, {
    method: "POST",
    body: payload,
  });
  const parsedResponse = createTripOrderResponseSchema.safeParse(rawResponse);

  if (!parsedResponse.success) {
    throw new Error(
      `The order response did not match the expected format: ${parsedResponse.error.issues[0]?.message ?? "invalid response"}`,
    );
  }

  if (!parsedResponse.data.success) {
    throw new Error(
      parsedResponse.data.message || "Failed to create trip order.",
    );
  }

  if (!parsedResponse.data.data) {
    throw new Error("The order response did not include a valid order ID.");
  }
  const orderData = parsedResponse.data.data;
  const postId = orderData.postId ?? orderData.uid;
  if (!postId) {
    throw new Error("The order response did not include a valid order ID.");
  }

  return {
    success: true,
    message: parsedResponse.data.message ?? "",
    data: {
      postId,
      status: orderData.status,
      totalItems: orderData.totalItems ?? payload.items.length,
      totalCost: String(orderData.totalCost ?? orderData.total ?? "0"),
      payment: orderData.payment
        ? {
            clientSecret: orderData.payment.clientSecret,
            captureBefore: orderData.payment.captureBefore ?? null,
          }
        : null,
    },
  };
};

export const createOpenRequest = async (
  payload: CreateOpenRequestApiPayload,
): Promise<CreateOpenRequestResponse> => {
  const response = await apiRequest<{
    success: boolean;
    message?: string;
    data?: {
      postId?: string;
      status?: string;
      totalItems?: number;
      totalCost?: string | number;
      payment?: {
        clientSecret?: string;
        captureBefore?: string | null;
      } | null;
    };
  }>(
    apiEndpoints.requests.requests,
    {
      method: "POST",
      body: payload,
    },
  );

  if (!response?.success) {
    throw new Error(response?.message || "Failed to create request.");
  }
  if (
    !response.data ||
    typeof response.data.postId !== "string" ||
    !response.data.postId.trim() ||
    (response.data.status !== "pending" && response.data.status !== "open")
  ) {
    throw new Error(
      "The request response did not include valid request details.",
    );
  }

  if (
    typeof response.data.totalItems !== "number" ||
    (typeof response.data.totalCost !== "string" &&
      typeof response.data.totalCost !== "number")
  ) {
    throw new Error("The request response did not include valid payment totals.");
  }

  const payment = response.data.payment;
  if (
    payment !== null &&
    payment !== undefined &&
    (typeof payment.clientSecret !== "string" ||
      !payment.clientSecret.trim())
  ) {
    throw new Error("The request response included invalid payment details.");
  }

  return {
    success: true,
    message: response.message ?? "",
    data: {
      postId: response.data.postId,
      status: response.data.status,
      totalItems: response.data.totalItems,
      totalCost: String(response.data.totalCost),
      payment:
        payment?.clientSecret
          ? {
              clientSecret: payment.clientSecret,
              captureBefore: payment.captureBefore ?? null,
            }
          : null,
    },
  };
};

export const submitOffer = async (
  requestUid: string,
  payload: SubmitRequestOfferPayload,
): Promise<SubmitRequestOfferResponse> => {
  const response = await apiRequest<SubmitRequestOfferResponse>(
    apiEndpoints.requests.submitOffer.replace(
      ":uid",
      encodeURIComponent(requestUid),
    ),
    {
      method: "POST",
      body: payload,
    },
  );

  if (!response.success) {
    throw new Error(response.message || "Unable to send your offer.");
  }
  if (!response.data || typeof response.data.uid !== "string") {
    throw new Error("The offer response did not include offer details.");
  }

  return response;
};
