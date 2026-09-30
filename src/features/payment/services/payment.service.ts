import { apiRequest } from "../../../shared/api/apiClient";
import { apiEndpoints } from "../../../constant/url";

export const paymentService = {
  initiateCheckout: async (requestSlug: string) => {
    return apiRequest(apiEndpoints.payments.checkout, {
      method: "POST",
      body: { requestSlug },
    });
  },
};
