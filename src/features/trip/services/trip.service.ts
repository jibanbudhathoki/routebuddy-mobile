import { apiRequest } from '../../../shared/api/apiClient';
import { apiEndpoints } from '../../../constant/url';
import type { CreateTripRequest } from '../types/trip';

export const tripService = {
  async createTrip(data: CreateTripRequest) {
    const response = await apiRequest<any>(apiEndpoints.trips, {
      method: 'POST',
      body: data,
    });
    return response.data;
  },
};
