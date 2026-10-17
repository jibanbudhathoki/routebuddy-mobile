import { apiRequest } from "../../../shared/api/apiClient";
import { apiEndpoints } from "../../../constant/url";
import type {
  CreatePaymentIntentRequest,
  PaymentIntentResponse,
  PaymentHistoryItem,
  CheckoutResponse,
  ConfirmDeliveryResponse,
  PaymentDetail,
} from "../types/payment.types";

export const paymentService = {

  createPaymentIntent: async (
    data: CreatePaymentIntentRequest,
  ): Promise<PaymentIntentResponse> => {
    return apiRequest<PaymentIntentResponse>(apiEndpoints.payments.intent, {
      method: "POST",
      body: {
        amount: data.amount,
        currency: data.currency || "usd",
        metadata: data.metadata,
      },
    });
  },

  /**
   * GET /api/v1/payments/history
   * Get payment transaction history for authenticated user
   */
  getPaymentHistory: async (): Promise<PaymentHistoryItem[]> => {
    const response = await apiRequest<any>(apiEndpoints.payments.history, {
      method: "GET",
    });

    if (Array.isArray(response)) {
      return response;
    }
    if (response?.data && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  },

  initiateCheckout: async (
    requestSlug: string,
    paymentMethodId?: string,
  ): Promise<CheckoutResponse> => {
    const response = await apiRequest<CheckoutResponse>(
      apiEndpoints.payments.checkout,
      {
        method: "POST",
        body: paymentMethodId
          ? { requestSlug, paymentMethodId }
          : { requestSlug },
      },
    );
    if (!response?.data?.clientSecret) {
      throw new Error("The checkout response did not include payment details.");
    }
    return response;
  },

  confirmDelivery: async (
    requestSlug: string,
  ): Promise<ConfirmDeliveryResponse> => {
    return apiRequest<ConfirmDeliveryResponse>(
      apiEndpoints.payments.confirmDelivery,
      {
        method: "POST",
        body: { requestSlug },
      },
    );
  },


  getPaymentById: async (id: string): Promise<PaymentDetail> => {
    const endpoint = apiEndpoints.payments.paymentDetail.replace(
      ":id",
      encodeURIComponent(id),
    );
    const response = await apiRequest<any>(endpoint, {
      method: "GET",
    });
    return response?.data ?? response;
  },
};
