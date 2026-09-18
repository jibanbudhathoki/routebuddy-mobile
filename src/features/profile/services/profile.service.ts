import { apiRequest } from '../../../shared/api/apiClient';
import { apiEndpoints } from '../../../constant/url';

export interface UserProfile {
  uid: string;
  slug: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  photoUrl: string | null;
  provider: string;
  phone: string | null;
  homeTown: string | null;
  rating: number | null;
  createdAt: string;
  updatedAt: string;
}

export const profileService = {
  async getProfile() {
    const response = await apiRequest<any>(apiEndpoints.profile, {
      method: 'GET',
    });
    return response.data as UserProfile;
  },

  async updateProfile(data: { firstName: string; lastName: string; phone?: string }) {
    const response = await apiRequest<any>(apiEndpoints.profile, {
      method: 'PUT',
      body: {
        displayName: `${data.firstName} ${data.lastName}`.trim(),
        phone: data.phone,
      },
    });
    return response.data as UserProfile;
  },
};
