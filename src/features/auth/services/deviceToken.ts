import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { getApp } from '@react-native-firebase/app';
import { getMessaging, getToken } from '@react-native-firebase/messaging';

import { apiRequest } from '../../../shared/api/apiClient';
import { getAuthSession } from './authStorage';
import { deviceTokenStorage } from '../../../shared/storage/deviceTokenStorage';
import { apiEndpoints } from '../../../constant/url';

type DeviceTokenResponse = {
  success?: boolean;
  message?: string;
};

let deviceTokenSessionQueue: Promise<void> = Promise.resolve();

export function withDeviceTokenSessionLock<T>(operation: () => Promise<T>): Promise<T> {
  const result = deviceTokenSessionQueue.then(operation, operation);
  deviceTokenSessionQueue = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}

export async function getDeviceToken(): Promise<string> {
  if (Platform.OS === 'web') {
    throw new Error('Push notifications are only supported in the iOS and Android apps.');
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('routebuddy-default', {
      name: 'RouteBuddy Alerts',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    throw new Error('Notification permission is required to continue.');
  }

  const token = await getToken(getMessaging(getApp()));
  if (!token?.trim()) {
    throw new Error('Unable to get this device’s Firebase Cloud Messaging token.');
  }

  if (__DEV__) {
    console.info(`[FCM] Registration token: ${token}`);
  }

  await deviceTokenStorage.set(token);
  return token;
}

export async function registerDeviceToken(token: string, userId: string): Promise<void> {
  if (Platform.OS === 'web') {
    throw new Error('Push notifications are only supported in the iOS and Android apps.');
  }

  const session = await getAuthSession();
  if (!session || session.user.id !== userId) {
    throw new Error('Cannot register the notification token for an inactive account.');
  }

  await deviceTokenStorage.set(token);
  const response = await apiRequest<DeviceTokenResponse>(apiEndpoints.notifications.tokens, {
    body: { token, platform: Platform.OS },
    method: 'POST',
  });

  if (response.success === false) {
    throw new Error(response.message || 'Unable to register this device for notifications.');
  }

  const currentSession = await getAuthSession();
  if (!currentSession || currentSession.user.id !== userId) {
    throw new Error('The active account changed while registering the notification token.');
  }
}

export async function unregisterDeviceToken(token: string, userId: string): Promise<void> {
  if (Platform.OS === 'web') {
    throw new Error('Push notifications are only supported in the iOS and Android apps.');
  }

  const session = await getAuthSession();
  if (!session || session.user.id !== userId) {
    throw new Error('Cannot remove the notification token for an inactive account.');
  }

  await apiRequest<void>(
    `${apiEndpoints.notifications.tokens}/${encodeURIComponent(token)}`,
    { method: 'DELETE' },
  );

  const currentSession = await getAuthSession();
  if (!currentSession || currentSession.user.id !== userId) {
    throw new Error('The active account changed while removing the notification token.');
  }

  await deviceTokenStorage.remove();
}
