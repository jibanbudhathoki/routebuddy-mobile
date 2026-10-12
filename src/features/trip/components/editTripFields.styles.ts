import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  content: {
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  notice: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.sm,
    flexDirection: "row",
    gap: theme.spacing.xs,
    padding: theme.spacing.sm,
  },
  noticeText: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 11,
  },
  sectionTitle: {
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "700",
    paddingTop: theme.spacing.sm,
  },
  row: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  selectionContainer: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  fieldLabel: {
    color: theme.colors.muted,
    fontSize: 11,
    fontWeight: "600",
  },
  selectionField: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.xs,
    justifyContent: "space-between",
    minHeight: 44,
    paddingHorizontal: theme.spacing.sm,
  },
  selectionValue: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 11,
    fontWeight: "600",
  },
  capacityRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stepper: {
    alignItems: "center",
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: "row",
  },
  stepperButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 38,
    width: 40,
  },
  capacityValue: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "700",
    minWidth: 34,
    textAlign: "center",
  },
}));
