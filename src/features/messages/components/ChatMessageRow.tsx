import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type { Message } from "../types/message.types";
import { SystemChatNotice } from "./SystemChatNotice";

interface ChatMessageRowProps {
  message: Message;
  replyMessage?: Message;
  currentUserUid: string;
  participantName: string;
  participantAvatar: string | null;
  currentUserAvatar: string | null;
  selected: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

export function ChatMessageRow({
  message,
  replyMessage,
  currentUserUid,
  participantName,
  participantAvatar,
  currentUserAvatar,
  selected,
  onPress,
  onLongPress,
}: ChatMessageRowProps) {
  const { theme } = useUnistyles();

  if (message.type === "system" || message.senderId === null) {
    return <SystemChatNotice message={message} />;
  }

  const isMine =
    message.senderId === "me" ||
    (Boolean(currentUserUid) && message.senderId === currentUserUid);
  const messageText =
    message.type === "text"
      ? message.text
      : message.mediaUrl
        ? `${capitalize(message.type)}: ${message.mediaUrl}`
        : `${capitalize(message.type)} message`;
  const reactions = getReactionCounts(message.reactions);
  const avatarUrl = message.sender?.photoUrl ?? participantAvatar;
  const name = message.sender?.displayName ?? participantName;

  return (
    <View
      style={[
        styles.messageRow,
        isMine ? styles.messageRowMine : styles.messageRowOther,
      ]}
    >
      {!isMine ? <Avatar uri={avatarUrl} name={name} /> : null}
      <View
        style={[
          styles.messageColumn,
          isMine ? styles.messageColumnMine : styles.messageColumnOther,
        ]}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={onPress}
          onLongPress={onLongPress}
          accessibilityRole="button"
          accessibilityLabel={selected ? "Deselect message" : "Select message"}
          style={[
            styles.bubble,
            isMine ? styles.outgoingBubble : styles.incomingBubble,
            selected && styles.selectedBubble,
          ]}
        >
          {replyMessage ? (
            <View style={styles.messageReplyQuote}>
              <Text style={styles.messageReplyName} numberOfLines={1}>
                {replyMessage.sender?.displayName ?? "Message"}
              </Text>
              <Text style={styles.messageReplyText} numberOfLines={1}>
                {replyMessage.text}
              </Text>
            </View>
          ) : null}
          <Text style={styles.messageText}>{messageText}</Text>
          {selected ? (
            <MaterialCommunityIcons
              name="check-circle"
              size={15}
              color={theme.colors.primary}
              style={styles.selectedMark}
            />
          ) : null}
        </TouchableOpacity>
        {reactions.length ? (
          <View style={styles.reactionsRow}>
            {reactions.map(({ emoji, count }) => (
              <View key={emoji} style={styles.reactionBadge}>
                <Text style={styles.reactionText}>
                  {emoji} {count > 1 ? count : ""}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
        <View style={styles.messageMeta}>
          <Text style={styles.messageTime}>{formatTime(message.createdAt)}</Text>
          {isMine ? (
            <MaterialCommunityIcons
              name="check-all"
              size={13}
              color={theme.colors.primary}
            />
          ) : null}
        </View>
      </View>
      {isMine ? <Avatar uri={currentUserAvatar} name="You" small /> : null}
    </View>
  );
}

function Avatar({
  uri,
  name,
  small = false,
}: {
  uri: string | null;
  name: string;
  small?: boolean;
}) {
  const { theme } = useUnistyles();
  return (
    <View
      accessible
      accessibilityLabel={`${name} profile photo`}
      style={[styles.avatar, small && styles.smallAvatar]}
    >
      {uri ? (
        <Image source={{ uri }} style={styles.avatarImage} />
      ) : (
        <View style={styles.avatarFallback}>
          <MaterialCommunityIcons
            name="account"
            size={small ? 16 : 19}
            color={theme.colors.onPrimary}
          />
        </View>
      )}
    </View>
  );
}

function getReactionCounts(reactions: Message["reactions"]) {
  const counts = new Map<string, number>();
  if (Array.isArray(reactions)) {
    reactions.forEach((reaction) => {
      if (reaction.emoji) {
        counts.set(reaction.emoji, (counts.get(reaction.emoji) ?? 0) + 1);
      }
    });
  } else if (reactions) {
    Object.values(reactions).forEach((emoji) => {
      counts.set(emoji, (counts.get(emoji) ?? 0) + 1);
    });
  }
  return Array.from(counts, ([emoji, count]) => ({ emoji, count }));
}

function formatTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function capitalize(value: string) {
  return value ? `${value[0].toUpperCase()}${value.slice(1)}` : value;
}

const styles = StyleSheet.create((theme) => ({
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
