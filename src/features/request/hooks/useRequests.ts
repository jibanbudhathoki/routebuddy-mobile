import { useState } from "react";
import { requestService } from "../services/request.service";
import type { CreateOpenRequestApiPayload } from "../types/request";

export function useCreateRequest() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRequest = async (payload: CreateOpenRequestApiPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await requestService.createOpenRequest(payload);
      return response;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create request.";
      setError(message);
      throw err instanceof Error ? err : new Error(message);
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
