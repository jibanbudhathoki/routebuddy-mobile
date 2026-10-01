import { useState } from 'react';
import { listMyTrips } from '../services/trip.service';

export function useListMyTrip() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listMyTrip = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await listMyTrips();
      return { success: true, data: response };
    } catch (err: any) {
      const message = err?.message || 'Failed to list my trips. Please try again.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    listMyTrip,
    isLoading,
    error,
  };
}
