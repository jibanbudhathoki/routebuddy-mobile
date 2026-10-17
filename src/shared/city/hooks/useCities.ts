import { useQuery } from '@tanstack/react-query';

import { cityService } from '../services/city.service';
import type { GetCitiesParams } from '../types/city';

const referenceDataStaleTime = 5 * 60 * 1000;
const referenceDataGcTime = 30 * 60 * 1000;

function normalizeCityParams(params?: GetCitiesParams): GetCitiesParams {
  return {
    provinceUid: params?.provinceUid,
    search: params?.search,
    page: params?.page,
    limit: params?.limit,
  };
}

export const cityKeys = {
  all: ['cities'] as const,
  list: (params?: GetCitiesParams) =>
    [...cityKeys.all, normalizeCityParams(params)] as const,
};

export function useCities(params?: GetCitiesParams) {
  const normalizedParams = normalizeCityParams(params);
  const query = useQuery({
    queryKey: cityKeys.list(normalizedParams),
    queryFn: async () => {
      const response = await cityService.getCities(normalizedParams);
      return response.data || [];
    },
    staleTime: referenceDataStaleTime,
    gcTime: referenceDataGcTime,
  });

  return {
    cities: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
    refetch: query.refetch,
  };
}
