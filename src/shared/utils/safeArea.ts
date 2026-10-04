import { Platform, StatusBar } from 'react-native';

export function getTopSafeAreaInset(safeAreaTop: number) {
  const statusBarHeight =
    Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;

  return Math.max(safeAreaTop, statusBarHeight);
}
