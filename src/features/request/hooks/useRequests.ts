import { useState } from "react";
import { requestService, CreateOpenRequestApiPayload } from "../services/request.service";

export function useCreateRequest() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRequest = async (payload: CreateOpenRequestApiPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await requestService.createOpenRequest(payload);
      return response;
    } catch (err: any) {
      const message = err?.message || "Failed to create request.";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createRequest,
    isLoading,
    error,
  };
}
