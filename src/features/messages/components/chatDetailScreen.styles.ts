import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  composerSticky: {
    zIndex: 1,
  },
  screen: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  requestStatus: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.sm,
    paddingTop: theme.spacing.xs,
  },
}));
