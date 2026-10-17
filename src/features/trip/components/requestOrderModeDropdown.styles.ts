import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  currentSelection: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 44,
    paddingHorizontal: theme.spacing.md,
  },
  currentLabel: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  option: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 42,
    paddingHorizontal: theme.spacing.md,
  },
  selectedOption: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  label: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "600",
  },
  selectedLabel: {
    color: theme.colors.onPrimary,
  },
}));
