import { apiRequest } from '../../../shared/api/apiClient';
import { apiEndpoints } from '../../../constant/url';
import { saveAuthSession } from './authStorage';
import type {
  AuthResponse,
  GoogleSessionRequest,
  LoginRequest,
  ResetPasswordRequest,
  SignUpRequest,
  VerifyEmailRequest,
} from '../types/auth';

type AuthMessageResponse = {
  success: boolean;
  message: string;
  data: Record<string, never>;
};

export const authService = {
  async signUp(request: SignUpRequest) {
    const response = await apiRequest<AuthMessageResponse>(
      apiEndpoints.auth.register,
      {
        body: request,
        method: 'POST',
      },
    );

    if (!response.success) {
      throw new Error(response.message || 'Unable to create your account.');
    }

    return response;
  },

  async verifyEmail(request: VerifyEmailRequest) {
    const response = await apiRequest<AuthMessageResponse>(
      apiEndpoints.auth.verifyEmail,
      {
        body: request,
        method: 'POST',
      },
    );

    if (!response.success) {
      throw new Error(response.message || 'Unable to verify your email.');
    }

    return response;
  },

  async forgotPassword(email: string) {
    const response = await apiRequest<AuthMessageResponse>(
      apiEndpoints.auth.forgotPassword,
      {
        body: { email },
        method: 'POST',
      },
    );

    if (!response.success) {
      throw new Error(response.message || 'Unable to send the reset code.');
    }

    return response;
  },

  async resetPassword(request: ResetPasswordRequest) {
    const response = await apiRequest<AuthMessageResponse>(
      apiEndpoints.auth.resetPassword,
      {
        body: request,
        method: 'POST',
      },
    );

    if (!response.success) {
      throw new Error(response.message || 'Unable to reset your password.');
    }

    return response;
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

  async createGoogleSession(
    request: GoogleSessionRequest,
    googleUser: AuthResponse['user'],
  ) {
    const response = await apiRequest<{
      success?: boolean;
      message?: string;
      data?: {
        idToken?: string;
        accessToken?: string;
        refreshToken?: string;
        user?: {
          uid?: string;
          id?: string;
          displayName?: string;
          fullName?: string;
          email?: string;
        };
      };
      idToken?: string;
      accessToken?: string;
      refreshToken?: string;
      user?: {
        uid?: string;
        id?: string;
        displayName?: string;
        fullName?: string;
        email?: string;
      };
    }>(apiEndpoints.auth.session, {
      body: request,
      method: 'POST',
    });

    if (response.success === false) {
      throw new Error(response.message || 'Unable to sign in with Google.');
    }

    const payload = response.data ?? response;
    const accessToken = payload.idToken || payload.accessToken;
    if (!accessToken) {
      throw new Error(response.message || 'The Google session response did not include an access token.');
    }

    const authSession: AuthResponse = {
      accessToken,
      refreshToken: payload.refreshToken,
      user: {
        id: payload.user?.uid || payload.user?.id || googleUser.id,
        fullName:
          payload.user?.displayName ||
          payload.user?.fullName ||
          googleUser.fullName,
        email: payload.user?.email || googleUser.email,
      },
    };

    await saveAuthSession(authSession);
    return authSession;
  },
};