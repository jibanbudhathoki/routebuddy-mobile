import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  overlay: {
    backgroundColor: theme.colors.overlay,
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  grabber: {
    alignSelf: "center",
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    height: 4,
    marginBottom: theme.spacing.sm,
    width: 40,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 40,
  },
  title: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  closeButton: {
    alignItems: "center",
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  dropdown: {
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    minHeight: 64,
    padding: theme.spacing.sm,
  },
  statusIcon: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  dropdownCopy: {
    flex: 1,
    gap: 3,
  },
  dropdownTitle: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  dropdownValue: {
    color: theme.colors.muted,
    fontSize: 10,
  },
  statusOption: {
    alignItems: "center",
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 48,
    paddingHorizontal: theme.spacing.sm,
  },
  selectedOption: {
    backgroundColor: theme.colors.primarySoft,
  },
  statusOptionLabel: {
    color: theme.colors.text,
    fontSize: 12,
  },
  selectedLabel: {
    color: theme.colors.primary,
    fontWeight: "700",
  },
}));
