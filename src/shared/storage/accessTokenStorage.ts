import * as SecureStore from 'expo-secure-store';

export const accessTokenQueryKey = 'routebuddy.auth.access-token';

export const accessTokenStorage = {
  get: () => SecureStore.getItemAsync(accessTokenQueryKey),
  set: (token: string) => {
    if (!token) return Promise.resolve();
    return SecureStore.setItemAsync(accessTokenQueryKey, token);
  },
  remove: () => SecureStore.deleteItemAsync(accessTokenQueryKey),
};