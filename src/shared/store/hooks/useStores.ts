import { useState, useEffect, useCallback } from 'react';
import { storeService } from '../services/store.service';
import type { Store, GetStoresParams } from '../types/store';

export function useStores(initialParams?: GetStoresParams) {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStores = useCallback(async (params?: GetStoresParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await storeService.getStores(params);
      setStores(response.data?.data || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch stores.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStores(initialParams);
  }, [fetchStores, JSON.stringify(initialParams)]);

  return {
    stores,
    isLoading,
    error,
    refetch: fetchStores,
  };
}
