import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  backButton: {},
  headerTextContainer: {
    alignItems: "center",
    marginTop: -24,
  },
  title: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  footer: {
    padding: 16,
    paddingBottom: 24,
  },
  statusCard: {
    alignItems: "center",
    flex: 1,
    gap: theme.spacing.sm,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  statusText: {
    color: theme.colors.muted,
    fontSize: 13,
    textAlign: "center",
  },
  errorText: {
    color: theme.colors.error,
    flex: 1,
    fontSize: 12,
  },
  inlineError: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  retryButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  retryText: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  photoProgress: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm,
    justifyContent: "center",
    paddingBottom: theme.spacing.sm,
  },
  cityPickerError: {
    color: theme.colors.error,
    fontSize: 12,
    marginHorizontal: theme.spacing.md,
  },
}));
