import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { deviceTokenStorage } from '../../../shared/storage/deviceTokenStorage';

export async function getDeviceToken(): Promise<string> {
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

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  if (!projectId) {
    throw new Error('Unable to find the Expo project ID for push notifications.');
  }

  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  if (!token?.trim()) {
    throw new Error('Unable to get this device’s notification token.');
  }

  await deviceTokenStorage.set(token);
  return token;
}
