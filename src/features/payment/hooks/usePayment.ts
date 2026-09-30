import { useState } from "react";
import { paymentService } from "../services/payment.service";

export function usePayment() {
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiateCheckout = async (requestSlug: string) => {
    setIsInitializing(true);
    setError(null);
    try {
      const response = await paymentService.initiateCheckout(requestSlug);
      return response;
    } catch (err: any) {
      const message = err?.message || "Failed to initiate payment.";
      setError(message);
      throw new Error(message);
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
