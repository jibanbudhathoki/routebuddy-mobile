import { apiRequest } from "../../../shared/api/apiClient";
import { apiEndpoints } from "../../../constant/url";
import {
  clearAuthSession,
  getAuthSession,
  saveAuthSession,
} from "../../auth/services/authStorage";
import {
  unregisterDeviceToken,
  withDeviceTokenSessionLock,
} from "../../auth/services/deviceToken";
import { deviceTokenStorage } from "../../../shared/storage/deviceTokenStorage";
import type {
  ChangePasswordInput,
  ChangeEmailInput,
  VerifyChangeEmailInput,
} from "../validations/security.schema";

export const securityService = {
  async changePassword(data: ChangePasswordInput): Promise<{ message?: string }> {
    const session = await getAuthSession();
    if (!session?.accessToken || !session?.user?.email) {
      throw new Error("You must be signed in to change your password.");
    }

    const response = await apiRequest<{ message?: string; success?: boolean }>(
      apiEndpoints.auth.changePassword,
      {
        method: "POST",
        body: {
          idToken: session.accessToken,
          email: session.user.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
        },
      },
    );

    return response;
  },

  async requestEmailChange(data: ChangeEmailInput): Promise<{ message: string }> {
    const response = await apiRequest<{ message: string }>(
      apiEndpoints.auth.changeEmail,
      {
        method: "POST",
        body: {
          email: data.email,
        },
      },
    );

    return response;
  },

  async verifyEmailChange(
    data: VerifyChangeEmailInput & { email: string },
  ): Promise<{ message: string }> {
    const response = await apiRequest<{ message: string }>(
      apiEndpoints.auth.verifyChangeEmail,
      {
        method: "POST",
        body: {
          email: data.email,
          code: data.code,
        },
      },
    );

    // Update stored session with new email
    const session = await getAuthSession();
    if (session?.user) {
      await saveAuthSession({
        ...session,
        user: {
          ...session.user,
          email: data.email,
        },
      });
    }

    return response;
  },

  async deleteAccount(): Promise<{ message?: string; success?: boolean }> {
    const session = await getAuthSession();
    if (!session?.accessToken) {
      throw new Error("You must be signed in to delete your account.");
    }

    const response = await apiRequest<{ message?: string; success?: boolean }>(
      apiEndpoints.auth.deleteAccount,
      {
        method: "POST",
        body: {
          idToken: session.accessToken,
          confirm: true,
        },
      },
    );

    await withDeviceTokenSessionLock(async () => {
      try {
        const deviceToken = await deviceTokenStorage.get();
        if (session && deviceToken) {
          try {
            await unregisterDeviceToken(deviceToken, session.user.id);
          } catch (e) {
            console.warn("Failed to unregister device token on account deletion:", e);
          }
        }
      } finally {
        await clearAuthSession();
      }
    });

    return response;
  },
};
