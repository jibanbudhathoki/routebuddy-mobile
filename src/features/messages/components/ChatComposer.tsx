import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type { Message } from "../types/message.types";

interface ChatComposerProps {
  messageText: string;
  onMessageTextChange: (value: string) => void;
  onSend: () => void;
  isSending: boolean;
  enabled: boolean;
  error?: string;
  replyTo: Message | null;
  onCancelReply: () => void;
  bottomPadding: number;
}

export function ChatComposer({
  messageText,
  onMessageTextChange,
  onSend,
  isSending,
  enabled,
  error,
  replyTo,
  onCancelReply,
  bottomPadding,
}: ChatComposerProps) {
  const { theme } = useUnistyles();
  const canSend = Boolean(messageText.trim()) && !isSending && enabled;

  return (
    <View style={[styles.container, { paddingBottom: bottomPadding }]}>
      {error ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      ) : null}
      {replyTo ? (
        <View style={styles.replyPreview}>
          <View style={styles.replyCopy}>
            <Text style={styles.replyTitle}>
              Replying to {replyTo.sender?.displayName ?? "message"}
            </Text>
            <Text numberOfLines={1} style={styles.replyText}>
              {replyTo.text}
            </Text>
          </View>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Cancel reply"
            onPress={onCancelReply}
            style={styles.cancelReplyButton}
          >
            <MaterialCommunityIcons
              name="close"
              size={18}
              color={theme.colors.muted}
            />
          </TouchableOpacity>
        </View>
      ) : null}
      <View style={styles.composer}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Attachments"
          style={styles.addButton}
        >
          <MaterialCommunityIcons
            name="plus"
            size={23}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
        <View style={styles.inputPill}>
          <TextInput
            accessibilityLabel="Type a message"
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={theme.colors.muted}
            multiline
            value={messageText}
            onChangeText={onMessageTextChange}
            editable={enabled && !isSending}
          />
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Take a photo"
            style={styles.cameraButton}
          >
            <MaterialCommunityIcons
              name="camera-outline"
              size={21}
              color={theme.colors.muted}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Send message"
          style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
          onPress={onSend}
          disabled={!canSend}
        >
          {isSending ? (
            <ActivityIndicator color={theme.colors.onPrimary} size="small" />
          ) : (
            <MaterialCommunityIcons
              name="send"
              size={19}
              color={theme.colors.onPrimary}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.surface,
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    paddingHorizontal: theme.spacing.sm,
    paddingTop: theme.spacing.xs,
  },
  error: {
    color: theme.colors.error,
    fontSize: 11,
    marginBottom: theme.spacing.xs,
  },
  replyPreview: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderLeftColor: theme.colors.primary,
    borderLeftWidth: 3,
    borderRadius: theme.radius.sm,
    flexDirection: "row",
    marginBottom: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  replyCopy: {
    flex: 1,
    minWidth: 0,
  },
  replyTitle: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: "700",
  },
  replyText: {
    color: theme.colors.text,
    fontSize: 11,
    marginTop: 2,
  },
  cancelReplyButton: {
    alignItems: "center",
    height: 30,
    justifyContent: "center",
    marginLeft: theme.spacing.xs,
    width: 30,
  },
  composer: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  addButton: {
    alignItems: "center",
    borderColor: theme.colors.border,
    borderRadius: 22,
    borderWidth: 1,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  inputPill: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: 22,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    minHeight: 40,
    paddingLeft: theme.spacing.sm,
    paddingRight: theme.spacing.xs,
  },
  input: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 12,
    maxHeight: 82,
    paddingVertical: theme.spacing.xs,
  },
  cameraButton: {
    alignItems: "center",
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  sendButton: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  sendButtonDisabled: {
    opacity: 0.55,
  },
}));
