import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  orderList: {
    gap: theme.spacing.xs,
  },
  orderCard: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.sm,
    minHeight: 72,
    padding: theme.spacing.sm,
  },
  orderCardPressed: {
    backgroundColor: theme.colors.primarySoft,
  },
  orderSummary: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  requesterName: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  route: {
    color: theme.colors.muted,
    fontSize: 10,
  },
  orderStatus: {
    color: theme.colors.text,
    fontSize: 9,
    fontWeight: "600",
  },
  total: {
    color: theme.colors.text,
    fontSize: 10,
    fontWeight: "600",
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
    padding: theme.spacing.xs,
  },
  retryText: {
    color: theme.colors.text,
    fontSize: 11,
    fontWeight: "700",
  },
}));
