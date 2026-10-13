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
    width: 40,
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  content: {
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
  },
  orderList: {
    gap: theme.spacing.md,
  },
  orderCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    overflow: "hidden",
    paddingHorizontal: theme.spacing.sm,
  },
  requesterHeader: {
    alignItems: "center",
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  requesterIcon: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.sm,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  requesterInfo: {
    flex: 1,
    gap: 2,
  },
  requesterLabel: {
    color: theme.colors.muted,
    fontSize: 8,
    fontWeight: "700",
  },
  requesterName: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  itemsCount: {
    color: theme.colors.muted,
    fontSize: 9,
  },
  storeHeader: {
    alignItems: "center",
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
  },
  storeName: {
    color: theme.colors.text,
    fontSize: 10,
    fontWeight: "600",
  },
  itemRow: {
    alignItems: "center",
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.sm,
    minHeight: 54,
    paddingVertical: theme.spacing.xs,
  },
  checkbox: {
    alignItems: "center",
    borderColor: theme.colors.muted,
    borderRadius: 4,
    borderWidth: 1,
    height: 20,
    justifyContent: "center",
    width: 20,
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    color: theme.colors.text,
    fontSize: 11,
    fontWeight: "600",
  },
  itemChecked: {
    textDecorationLine: "line-through",
    color: theme.colors.muted,
  },
  itemDescription: {
    color: theme.colors.muted,
    fontSize: 9,
  },
  itemPrice: {
    color: theme.colors.text,
    fontSize: 10,
    fontWeight: "600",
  },
  footer: {
    backgroundColor: theme.colors.background,
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    paddingBottom: theme.spacing.xs,
    paddingTop: theme.spacing.sm,
  },
  saveButton: {
    minHeight: 48,
  },
  buttonIcon: {
    alignItems: "center",
    height: 48,
    justifyContent: "center",
    left: theme.spacing.lg,
    pointerEvents: "none",
    position: "absolute",
    top: theme.spacing.sm,
    width: 22,
  },
  state: {
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
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: "700",
  },
}));
