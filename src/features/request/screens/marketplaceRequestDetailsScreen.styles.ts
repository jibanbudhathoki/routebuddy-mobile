import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    height: 48,
    justifyContent: "space-between",
  },
  headerAction: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    width: 34,
  },
  headerActions: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    width: 68,
  },
  headerTitle: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  content: {
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    paddingTop: theme.spacing.xs,
  },
  sections: {
    gap: theme.spacing.sm,
  },
  stateCard: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
  },
  stateTitle: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  stateText: {
    color: theme.colors.muted,
    fontSize: 11,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    marginTop: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  retryButtonText: {
    color: theme.colors.onPrimary,
    fontSize: 11,
    fontWeight: "600",
  },
  footer: {
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    paddingBottom: theme.spacing.xs,
    paddingTop: theme.spacing.xs,
  },
  messageButton: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: 6,
    flexDirection: "row",
    gap: theme.spacing.sm,
    height: 42,
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.65,
  },
  messageButtonText: {
    color: theme.colors.onPrimary,
    fontSize: 12,
    fontWeight: "700",
  },
}));
