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
  grabberArea: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 24,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    height: 42,
    justifyContent: "space-between",
  },
  headerSpacer: {
    width: 36,
  },
  title: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  closeButton: {
    alignItems: "center",
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  options: {
    marginTop: theme.spacing.xs,
  },
  option: {
    alignItems: "center",
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.sm,
    minHeight: 80,
    paddingVertical: theme.spacing.sm,
  },
  optionDisabled: {
    opacity: 0.6,
  },
  optionIcon: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 22,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  destructiveIcon: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  optionCopy: {
    flex: 1,
    gap: 4,
  },
  optionTitle: {
    color: theme.colors.text,
    fontSize: 11,
    fontWeight: "700",
  },
  destructiveTitle: {
    color: theme.colors.error,
  },
  optionDescription: {
    color: theme.colors.muted,
    fontSize: 9,
    lineHeight: 13,
  },
  toggleCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.sm,
    gap: theme.spacing.xs,
    marginVertical: theme.spacing.xs,
    padding: theme.spacing.sm,
  },
  toggleHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoNote: {
    alignItems: "flex-start",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 6,
    flexDirection: "row",
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
    padding: theme.spacing.sm,
  },
  infoCopy: {
    flex: 1,
    gap: 4,
  },
  infoText: {
    color: theme.colors.text,
    fontSize: 8,
    lineHeight: 12,
  },
  statusDropdown: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.sm,
    gap: theme.spacing.xs,
    marginVertical: theme.spacing.xs,
    padding: theme.spacing.sm,
  },
  statusPrompt: {
    color: theme.colors.muted,
    fontSize: 10,
    fontWeight: "600",
    paddingBottom: theme.spacing.xs,
  },
  statusChoice: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 42,
    paddingHorizontal: theme.spacing.sm,
  },
  statusChoiceSelected: {
    borderColor: theme.colors.primary,
  },
  statusChoiceText: {
    color: theme.colors.text,
    fontSize: 11,
    fontWeight: "600",
  },
  statusChoiceTextSelected: {
    color: theme.colors.primary,
  },
  statusFootnote: {
    color: theme.colors.muted,
    fontSize: 9,
    lineHeight: 13,
    paddingTop: theme.spacing.xs,
  },
}));
