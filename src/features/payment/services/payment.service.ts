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
  /**
   * POST /api/v1/payments/intent
   * Create a payment intent for a direct transaction
   */
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

  /**
   * POST /api/v1/payments/checkout
   * Checkout an accepted or pending request and pre-authorize payment via Stripe.
   * If a saved card is selected, send its paymentMethodId.
   */
  initiateCheckout: async (
    requestSlug: string,
    paymentMethodId?: string,
  ): Promise<CheckoutResponse> => {
    return apiRequest<CheckoutResponse>(apiEndpoints.payments.checkout, {
      method: "POST",
      body: paymentMethodId
        ? { requestSlug, paymentMethodId }
        : { requestSlug },
    });
  },

  /**
   * POST /api/v1/payments/confirm-delivery
   * Confirm delivery, capture pre-authorized payment, and credit driver wallet
   */
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

  /**
   * GET /api/v1/payments/{id}
   * Get a specific payment transaction detail by ID
   */
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
