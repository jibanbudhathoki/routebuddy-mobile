import * as SecureStore from 'expo-secure-store';

export const userQueryKey = 'routebuddy.auth.user';

export const userStorage = {
  async get<T>(): Promise<T | null> {
    const storedUser = await SecureStore.getItemAsync(userQueryKey);

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as T;
    } catch {
      await userStorage.remove();
      return null;
    }
  },
  set: <T>(user: T) => {
    if (!user) return Promise.resolve();
    return SecureStore.setItemAsync(userQueryKey, JSON.stringify(user));
  },
  remove: () => SecureStore.deleteItemAsync(userQueryKey),
};