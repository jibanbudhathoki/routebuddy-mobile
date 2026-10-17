import { useQuery } from '@tanstack/react-query';

import { storeService } from '../services/store.service';
import type { GetStoresParams } from '../types/store';

const referenceDataStaleTime = 5 * 60 * 1000;
const referenceDataGcTime = 30 * 60 * 1000;

function normalizeStoreParams(params?: GetStoresParams): GetStoresParams {
  return {
    sortOrder: params?.sortOrder,
    sortBy: params?.sortBy,
    type: params?.type,
    provinceUid: params?.provinceUid,
    cityUid: params?.cityUid,
    search: params?.search,
    page: params?.page,
    limit: params?.limit,
  };
}

export const storeKeys = {
  all: ['stores'] as const,
  list: (params?: GetStoresParams) =>
    [...storeKeys.all, normalizeStoreParams(params)] as const,
};

export function useStores(params?: GetStoresParams) {
  const normalizedParams = normalizeStoreParams(params);
  const query = useQuery({
    queryKey: storeKeys.list(normalizedParams),
    queryFn: async () => {
      const response = await storeService.getStores(normalizedParams);
      return response.data || [];
    },
    staleTime: referenceDataStaleTime,
    gcTime: referenceDataGcTime,
  });

  return {
    stores: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
    refetch: query.refetch,
  };
}
