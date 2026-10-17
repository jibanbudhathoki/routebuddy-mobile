import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { getAuthSession } from '../features/auth/services/authStorage';
import { getRefreshToken } from '../features/auth/services/authStorage';
import { useUnistyles } from 'react-native-unistyles';

export default function Index() {
  const { theme } = useUnistyles();
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.text} />
      </View>
    );
  }

  if (isLoggedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}
