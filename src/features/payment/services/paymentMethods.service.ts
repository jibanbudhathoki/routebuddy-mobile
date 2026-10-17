import { apiRequest } from "../../../shared/api/apiClient";
import { apiEndpoints } from "../../../constant/url";
import {
  PaymentMethodItem,
  ApiPaymentMethod,
  SetupIntentResponse,
  mapApiPaymentMethod,
} from "../types/paymentMethod.types";

export const paymentMethodsService = {
  getPaymentMethods: async (): Promise<PaymentMethodItem[]> => {
    const response = await apiRequest<any>(apiEndpoints.payments.methods, {
      method: "GET",
    });

    const list: ApiPaymentMethod[] = Array.isArray(response)
      ? response
      : response?.data && Array.isArray(response.data)
      ? response.data
      : [];

    return list.map(mapApiPaymentMethod);
  },

  createSetupIntent: async (): Promise<SetupIntentResponse> => {
    const res = await apiRequest<any>(apiEndpoints.payments.setupIntent, {
      method: "POST",
    });
    return res?.data ?? res;
  },

  setDefaultPaymentMethod: async (id: string): Promise<void> => {
    const endpoint = apiEndpoints.payments.setDefaultMethod.replace(
      ":id",
      encodeURIComponent(id),
    );
    await apiRequest<{ message?: string }>(endpoint, {
      method: "PUT",
    });
  },

  deletePaymentMethod: async (id: string): Promise<void> => {
    const endpoint = apiEndpoints.payments.deleteMethod.replace(
      ":id",
      encodeURIComponent(id),
    );
    await apiRequest<{ message?: string }>(endpoint, {
      method: "DELETE",
    });
  },
};
