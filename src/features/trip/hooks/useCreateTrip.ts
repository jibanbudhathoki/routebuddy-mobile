import { useState } from 'react';
import { tripService } from '../services/trip.service';
import type { CreateTripRequest } from '../types/trip';

export function useCreateTrip() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTrip = async (data: CreateTripRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await tripService.createTrip(data);
      return { success: true, data: response };
    } catch (err: any) {
      const message = err?.message || 'Failed to post trip. Please try again.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createTrip,
    isLoading,
    error,
  };
}
