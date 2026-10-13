import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  messageRow: {
    alignItems: "flex-end",
    flexDirection: "row",
    marginBottom: theme.spacing.xs,
  },
  messageRowOther: {
    justifyContent: "flex-start",
  },
  messageRowMine: {
    justifyContent: "flex-end",
  },
  avatar: {
    borderRadius: 16,
    height: 32,
    marginBottom: 16,
    marginRight: theme.spacing.xs,
    overflow: "hidden",
    width: 32,
  },
  smallAvatar: {
    height: 28,
    marginBottom: 16,
    marginLeft: theme.spacing.xs,
    marginRight: 0,
    width: 28,
  },
  avatarImage: {
    height: "100%",
    width: "100%",
  },
  avatarFallback: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    flex: 1,
    justifyContent: "center",
  },
  messageColumn: {
    maxWidth: "78%",
  },
  messageColumnOther: {
    alignItems: "flex-start",
  },
  messageColumnMine: {
    alignItems: "flex-end",
  },
  bubble: {
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  incomingBubble: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderBottomLeftRadius: 4,
  },
  outgoingBubble: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primarySoft,
    borderBottomRightRadius: 4,
  },
  selectedBubble: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
    paddingRight: theme.spacing.lg,
  },
  selectedMark: {
    position: "absolute",
    right: 4,
    top: 4,
  },
  messageText: {
    color: theme.colors.text,
    fontSize: 12,
    lineHeight: 18,
  },
  sharedLinkButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  sharedLinkText: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: "700",
  },
  messageReplyQuote: {
    borderLeftColor: theme.colors.primary,
    borderLeftWidth: 2,
    marginBottom: theme.spacing.xs,
    paddingLeft: theme.spacing.xs,
  },
  messageReplyName: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: "700",
  },
  messageReplyText: {
    color: theme.colors.muted,
    fontSize: 10,
    marginTop: 2,
  },
  messageMeta: {
    alignItems: "center",
    flexDirection: "row",
    gap: 3,
    marginHorizontal: 2,
    marginTop: 3,
  },
  reactionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.xs,
    marginTop: 3,
  },
  reactionBadge: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
  },
  reactionText: {
    color: theme.colors.text,
    fontSize: 10,
  },
  messageTime: {
    color: theme.colors.muted,
    fontSize: 9,
  },
}));
