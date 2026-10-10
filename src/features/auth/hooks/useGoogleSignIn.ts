import { useState } from 'react';
import { Platform } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { authService } from '../services/auth.service';
import { getDeviceToken } from '../services/deviceToken';

type GoogleServicesConfig = {
  client?: Array<{
    oauth_client?: Array<{
      client_id: string;
      client_type: number;
    }>;
  }>;
};

const googleServices =
  require('../../../../google-services.json') as GoogleServicesConfig;
const webClientId = googleServices.client
  ?.flatMap((client) => client.oauth_client ?? [])
  .find((client) => client.client_type === 3)?.client_id;

export function useGoogleSignIn() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  async function signIn(): Promise<boolean> {
    if (isSubmitting) {
      return false;
    }

    setError(undefined);
    setIsSubmitting(true);

    try {
      if (Platform.OS === 'web') {
        throw new Error('Google sign-in is available in the iOS and Android apps.');
      }
      if (!webClientId) {
        throw new Error('Google sign-in is not configured for this app.');
      }

      GoogleSignin.configure({ webClientId });
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (response.type !== 'success') {
        return false;
      }

      const idToken = response.data.idToken;
      if (!idToken) {
        throw new Error('Google did not return an ID token. Please try again.');
      }

      const deviceToken = await getDeviceToken();
      await authService.createGoogleSession(
        {
          idToken,
          deviceToken,
          platform: Platform.OS,
        },
        {
          id: response.data.user.id,
          fullName: response.data.user.name ?? '',
          email: response.data.user.email,
        },
      );
      return true;
    } catch (signInError) {
      setError(
        signInError instanceof Error
          ? signInError.message
          : 'We could not sign in with Google. Please try again.',
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return { error, isSubmitting, signIn };
}
