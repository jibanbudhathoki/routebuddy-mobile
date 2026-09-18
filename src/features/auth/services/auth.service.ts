import { apiRequest } from '../../../shared/api/apiClient';
import { apiEndpoints } from '../../../constant/url';
import { saveAuthSession } from './authStorage';
import type { AuthResponse, LoginRequest, SignUpRequest } from '../types/auth';

export const authService = {
  async signUp(request: SignUpRequest) {
    const response = await apiRequest<any>(apiEndpoints.auth.register, {
      body: request,
      method: 'POST',
    });

    const payload = response.data || response;
    const authSession: AuthResponse = {
      accessToken: payload.idToken || payload.accessToken,
      refreshToken: payload.refreshToken,
      user: payload.user ? {
        id: payload.user.uid || payload.user.id,
        fullName: payload.user.displayName || payload.user.fullName,
        email: payload.user.email,
      } : { id: '0', fullName: 'Unknown', email: '' },
    };

    await saveAuthSession(authSession);
    return authSession;
  },

  async logIn(request: LoginRequest) {
    const response = await apiRequest<any>(apiEndpoints.auth.login, {
      body: request,
      method: 'POST',
    });

    const payload = response.data || response;
    const authSession: AuthResponse = {
      accessToken: payload.idToken || payload.accessToken,
      refreshToken: payload.refreshToken,
      user: payload.user ? {
        id: payload.user.uid || payload.user.id,
        fullName: payload.user.displayName || payload.user.fullName,
        email: payload.user.email,
      } : { id: '0', fullName: 'Unknown', email: '' },
    };

    await saveAuthSession(authSession);
    return authSession;
  },
};