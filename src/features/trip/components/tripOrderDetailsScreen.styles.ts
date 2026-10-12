import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    height: 46,
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm,
  },
  headerButton: {
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
  },
  requesterCard: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
  },
  personInfo: {
    flex: 1,
    gap: 3,
  },
  eyebrow: {
    color: theme.colors.muted,
    fontSize: 9,
    fontWeight: "700",
  },
  personName: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  statusBadge: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 5,
  },
  statusText: {
    color: theme.colors.primary,
    fontSize: 9,
    fontWeight: "700",
  },
  section: {
    gap: theme.spacing.xs,
  },
  sectionHeading: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  sectionCaption: {
    color: theme.colors.muted,
    fontSize: 10,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.sm,
  },
  detailRow: {
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
  },
  detailDivider: {
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
  },
  detailLabel: {
    color: theme.colors.muted,
    fontSize: 10,
  },
  detailValue: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "600",
  },
  person: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  storeRow: {
    alignItems: "center",
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
  },
  storeInfo: {
    flex: 1,
    gap: 2,
  },
  storeName: {
    color: theme.colors.text,
    fontSize: 11,
    fontWeight: "600",
  },
  storeLocation: {
    color: theme.colors.muted,
    fontSize: 9,
  },
  itemRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
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
  itemDescription: {
    color: theme.colors.muted,
    fontSize: 10,
  },
  itemPrice: {
    color: theme.colors.text,
    fontSize: 10,
    fontWeight: "600",
  },
  emptyText: {
    color: theme.colors.muted,
    fontSize: 11,
    paddingVertical: theme.spacing.md,
    textAlign: "center",
  },
  notes: {
    color: theme.colors.text,
    fontSize: 11,
    lineHeight: 17,
    paddingVertical: theme.spacing.sm,
  },
  costRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.sm,
  },
  totalRow: {
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    marginTop: theme.spacing.xs,
  },
  totalLabel: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  totalValue: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  unassignedDriver: {
    color: theme.colors.muted,
    fontSize: 11,
    paddingVertical: theme.spacing.md,
  },
  state: {
    alignItems: "center",
    flex: 1,
    gap: theme.spacing.sm,
    justifyContent: "center",
    padding: theme.spacing.lg,
  },
  stateTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  stateText: {
    color: theme.colors.muted,
    fontSize: 12,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  retryText: {
    color: theme.colors.onPrimary,
    fontSize: 12,
    fontWeight: "600",
  },
}));
