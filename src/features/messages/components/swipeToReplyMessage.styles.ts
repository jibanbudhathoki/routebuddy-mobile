import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  replyAction: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    justifyContent: "center",
    marginBottom: theme.spacing.xs,
    width: 44,
  },
}));
