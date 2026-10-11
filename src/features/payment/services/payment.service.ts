import { apiRequest } from "../../../shared/api/apiClient";
import { apiEndpoints } from "../../../constant/url";

export interface CheckoutResponse {
  success: boolean;
  message: string;
  data: {
    clientSecret: string;
  };
}

export const paymentService = {
  initiateCheckout: async (requestSlug: string): Promise<CheckoutResponse> => {
    const response = await apiRequest<CheckoutResponse>(
      apiEndpoints.payments.checkout,
      {
      method: "POST",
      body: { requestSlug },
      },
    );
    if (!response?.success) {
      throw new Error(response?.message || "Failed to initiate payment.");
    }
    if (!response.data?.clientSecret) {
      throw new Error("The checkout response did not include payment details.");
    }
    return response;
  },
};
