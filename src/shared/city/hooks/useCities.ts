import { useState, useEffect, useCallback } from 'react';
import { cityService } from '../services/city.service';
import type { City, GetCitiesParams } from '../types/city';

export function useCities(initialParams?: GetCitiesParams) {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCities = useCallback(async (params?: GetCitiesParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await cityService.getCities(params);
      setCities(response.data?.data || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch cities.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCities(initialParams);
  }, [fetchCities, JSON.stringify(initialParams)]);

  return {
    cities,
    isLoading,
    error,
    refetch: fetchCities,
  };
}
