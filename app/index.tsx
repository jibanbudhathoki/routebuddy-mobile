import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { getAuthSession } from '../src/features/auth/services/authStorage';
import { getRefreshToken } from '../src/features/auth/services/authStorage';

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkPersistentLogin() {
      try {
        // First check for a full session (access token + user)
        const session = await getAuthSession();
        if (session) {
          setIsLoggedIn(true);
          setLoading(false);
          return;
        }

        // Even if access token expired, check if we have a refresh token
        // The API client interceptor will silently refresh on 401
        const refreshToken = await getRefreshToken();
        if (refreshToken) {
          setIsLoggedIn(true);
          setLoading(false);
          return;
        }

        // No session, no refresh token → go to login
        setIsLoggedIn(false);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    }

    checkPersistentLogin();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#0B2447" />
      </View>
    );
  }

  if (isLoggedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}
