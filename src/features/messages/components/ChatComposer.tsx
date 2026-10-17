import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type { Message } from "../types/message.types";
import { ChatAttachmentMenu } from "./ChatAttachmentMenu";

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
  onPickImage: () => void;
  onTakePhoto: () => void;
  onPickAudioFile: () => void;
  onVoiceMessage: () => void;
  isRecording: boolean;
  isMediaBusy: boolean;
  recordingDuration: number;
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
  onPickImage,
  onTakePhoto,
  onPickAudioFile,
  onVoiceMessage,
  isRecording,
  isMediaBusy,
  recordingDuration,
}: ChatComposerProps) {
  const { theme } = useUnistyles();
  const [isAttachmentMenuVisible, setAttachmentMenuVisible] = useState(false);
  const canSend = Boolean(messageText.trim()) && !isSending && enabled;
  const composerBusy = isSending || isMediaBusy;

  return (
    <View style={[styles.container, { paddingBottom: bottomPadding }]}>
      <ChatAttachmentMenu
        visible={isAttachmentMenuVisible}
        onClose={() => setAttachmentMenuVisible(false)}
        onPickImage={onPickImage}
        onTakePhoto={onTakePhoto}
        onPickAudio={onPickAudioFile}
      />
      {error ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      ) : null}
      {isRecording ? (
        <Text style={styles.recordingStatus}>
          Recording voice message · {formatRecordingDuration(recordingDuration)}
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
          disabled={!enabled || composerBusy || isRecording}
          onPress={() => setAttachmentMenuVisible(true)}
          style={styles.addButton}
        >
          <MaterialCommunityIcons
            name="plus"
            size={23}
            color={theme.colors.text}
          />
        </TouchableOpacity>
        <View style={styles.inputPill}>
          <TextInput
            accessibilityLabel="Type a message"
            style={styles.input}
            placeholder={
              isRecording ? "Recording voice message..." : "Type a message..."
            }
            placeholderTextColor={theme.colors.muted}
            multiline
            value={messageText}
            onChangeText={onMessageTextChange}
            editable={enabled && !composerBusy && !isRecording}
          />
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={
            messageText.trim()
              ? "Send message"
              : isRecording
                ? "Stop and send voice message"
                : "Record voice message"
          }
          style={[
            styles.sendButton,
            isRecording && styles.recordingButton,
            !canSend && !isRecording && styles.sendButtonDisabled,
          ]}
          onPress={() => {
            if (messageText.trim()) onSend();
            else onVoiceMessage();
          }}
          disabled={
            !enabled ||
            (composerBusy && !isRecording) ||
            (messageText.trim() ? !canSend : false)
          }
        >
          {composerBusy && !isRecording ? (
            <ActivityIndicator color={theme.colors.onPrimary} size="small" />
          ) : (
            <MaterialCommunityIcons
              name={
                messageText.trim()
                  ? "send"
                  : isRecording
                    ? "stop"
                    : "microphone"
              }
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
  recordingStatus: {
    color: theme.colors.error,
    fontSize: 12,
    fontWeight: "600",
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
    color: theme.colors.text,
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
  recordingButton: {
    backgroundColor: theme.colors.error,
  },
}));

function formatRecordingDuration(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
