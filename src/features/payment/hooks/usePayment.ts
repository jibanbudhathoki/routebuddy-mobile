import { useState } from "react";
import { paymentService } from "../services/payment.service";

export function usePayment() {
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiateCheckout = async (
    requestSlug: string,
    paymentMethodId?: string,
  ) => {
    setIsInitializing(true);
    setError(null);
    try {
      const response = await paymentService.initiateCheckout(
        requestSlug,
        paymentMethodId,
      );
      return response;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to initiate payment.";
      setError(message);
      throw err instanceof Error ? err : new Error(message);
    } finally {
      setIsInitializing(false);
    }
  };

  return {
    initiateCheckout,
    isInitializing,
    error,
  };
}
