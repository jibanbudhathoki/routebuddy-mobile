import * as SecureStore from 'expo-secure-store';

export const deviceTokenQueryKey = 'routebuddy.device.fcm-token';

export const deviceTokenStorage = {
  get: () => SecureStore.getItemAsync(deviceTokenQueryKey),
  set: (token: string) => {
    if (!token) return Promise.resolve();
    return SecureStore.setItemAsync(deviceTokenQueryKey, token);
  },
  remove: () => SecureStore.deleteItemAsync(deviceTokenQueryKey),
};
