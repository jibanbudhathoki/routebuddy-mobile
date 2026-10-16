import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.sm,
    width: 270,
  },
  heading: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  headingCopy: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  status: {
    color: theme.colors.muted,
    fontSize: 10,
  },
  photoList: {
    gap: theme.spacing.xs,
  },
  photo: {
    overflow: "hidden",
  },
  note: {
    color: theme.colors.text,
    fontSize: 12,
    lineHeight: 18,
  },
  confirmButton: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    flexDirection: "row",
    gap: theme.spacing.xs,
    justifyContent: "center",
    minHeight: 42,
    paddingHorizontal: theme.spacing.sm,
  },
  disabledButton: {
    opacity: 0.6,
  },
  confirmText: {
    color: theme.colors.onPrimary,
    fontSize: 12,
    fontWeight: "700",
  },
  confirmed: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.xs,
    minHeight: 32,
  },
  confirmedText: {
    color: theme.colors.text,
    fontSize: 11,
    fontWeight: "700",
  },
}));
