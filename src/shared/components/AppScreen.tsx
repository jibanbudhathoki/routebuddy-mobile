import type { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function AppScreen({ children }: PropsWithChildren) {
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    // Removed justifyContent: 'center' as it shouldn't be the default for all screens (can cause lists/forms to be centered vertically rather than top-aligned)
  },
}));