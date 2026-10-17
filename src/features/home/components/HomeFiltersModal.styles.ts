import { StyleSheet } from "react-native-unistyles";

export const homeFiltersModalStyles = StyleSheet.create((theme) => ({
  screen: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  header: {
    alignItems: "center",
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 58,
    paddingHorizontal: theme.spacing.md,
  },
  title: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  closeButton: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  fields: {
    flex: 1,
  },
  fieldsContent: {
    gap: theme.spacing.lg,
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  fieldGroup: {
    gap: theme.spacing.sm,
  },
  label: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  dropdown: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.sm,
    minHeight: 48,
    paddingHorizontal: theme.spacing.sm,
  },
  dropdownText: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 14,
  },
  placeholder: {
    color: theme.colors.muted,
  },
  dropdownOptions: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    overflow: "hidden",
  },
  dropdownList: {
    maxHeight: 180,
  },
  dropdownOption: {
    alignItems: "center",
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 44,
    paddingHorizontal: theme.spacing.sm,
  },
  dropdownOptionText: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 14,
  },
  noOptions: {
    color: theme.colors.muted,
    fontSize: 13,
    padding: theme.spacing.md,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    color: theme.colors.text,
    fontSize: 14,
    minHeight: 48,
    paddingHorizontal: theme.spacing.sm,
  },
  footer: {
    backgroundColor: theme.colors.background,
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
  },
  footerButton: {
    alignItems: "center",
    borderRadius: theme.radius.sm,
    flex: 1,
    justifyContent: "center",
    minHeight: 48,
  },
  clearButton: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  applyButton: {
    backgroundColor: theme.colors.primary,
  },
  clearButtonText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  applyButtonText: {
    color: theme.colors.onPrimary,
    fontSize: 14,
    fontWeight: "700",
  },
}));
