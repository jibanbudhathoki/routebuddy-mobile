import { apiRequest } from '../../api/apiClient';
import { apiEndpoints } from '../../../constant/url';
import type { GetStoresParams, StoreResponse } from '../types/store';

export const storeService = {
  async getStores(params?: GetStoresParams) {
    // Construct query string
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    const url = queryString ? `${apiEndpoints.stores}?${queryString}` : apiEndpoints.stores;

    const response = await apiRequest<StoreResponse>(url, {
      method: 'GET',
    });
    return response;
  },
};
