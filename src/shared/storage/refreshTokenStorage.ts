import * as SecureStore from 'expo-secure-store';

export const refreshTokenQueryKey = 'routebuddy.auth.refresh-token';

export const refreshTokenStorage = {
  get: () => SecureStore.getItemAsync(refreshTokenQueryKey),
  set: (token: string) => {
    if (!token) return Promise.resolve();
    return SecureStore.setItemAsync(refreshTokenQueryKey, token);
  },
  remove: () => SecureStore.deleteItemAsync(refreshTokenQueryKey),
};