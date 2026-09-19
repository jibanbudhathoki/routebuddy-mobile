import { apiRequest } from '../../api/apiClient';
import { apiEndpoints } from '../../../constant/url';
import type { GetCitiesParams, CityResponse } from '../types/city';

export const cityService = {
  async getCities(params?: GetCitiesParams) {
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
    const url = queryString ? `${apiEndpoints.cities}?${queryString}` : apiEndpoints.cities;

    const response = await apiRequest<CityResponse>(url, {
      method: 'GET',
    });
    return response;
  },
};
