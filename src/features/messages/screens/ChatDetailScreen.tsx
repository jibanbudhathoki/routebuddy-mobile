import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";

import { getAuthSession } from "../../auth/services/authStorage";
import {
  useConversationMessages,
  useDeleteConversation,
  useDeleteMessages,
  useListMessages,
  useMarkConversationAsRead,
  useReactToMessage,
  useSendConversationMessage,
} from "../hooks/useMessages";
import { MessageDialog, type MessageDialogAction } from "../components/MessageDialog";
import { ChatComposer } from "../components/ChatComposer";
import { ChatMessagesPanel } from "../components/ChatMessagesPanel";
import { ChatDetailHeader } from "../components/ChatDetailHeader";
import type { InboxMessage, Message } from "../types/message.types";
import { getTopSafeAreaInset } from "../../../shared/utils/safeArea";

export function ChatDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id: routeId } = useLocalSearchParams<{ id?: string }>();
  const conversationId = typeof routeId === "string" ? routeId : "";
  const {
    data: messages = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useConversationMessages(conversationId);
  const { data: inbox = [] } = useListMessages();
  const sendMessage = useSendConversationMessage(conversationId);
  const markAsRead = useMarkConversationAsRead();
  const deleteConversation = useDeleteConversation();
  const deleteMessages = useDeleteMessages(conversationId);
  const reactToMessage = useReactToMessage(conversationId);
  const markConversationRead = markAsRead.mutate;

  const [messageText, setMessageText] = useState("");
  const [currentUserUid, setCurrentUserUid] = useState("");
  const [sendError, setSendError] = useState("");
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
  const longPressedMessageId = useRef<string | null>(null);
  const [dialog, setDialog] = useState<{
    title: string;
    message?: string;
    actions: MessageDialogAction[];
  } | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!conversationId) return;
      markConversationRead(conversationId, {
        onError: (failure) =>
          setSendError(
            failure instanceof Error
              ? failure.message
              : "Unable to mark conversation as read.",
          ),
      });
    }, [conversationId, markConversationRead]),
  );

  useEffect(() => {
    let isActive = true;
    getAuthSession()
      .then((session) => {
        if (isActive) setCurrentUserUid(session?.user.id ?? "");
      })
      .catch((failure: unknown) => {
        if (isActive) {
          setSendError(
            failure instanceof Error
              ? failure.message
              : "Could not identify the current user.",
          );
        }
      });
    return () => {
      isActive = false;
    };
  }, []);

  const conversation = inbox.find(
    (item) => item.msgId === conversationId,
  ) as InboxMessage | undefined;
  const otherParticipant = messages.find(
    (message) =>
      message.senderId &&
      message.senderId !== "me" &&
      message.senderId !== currentUserUid,
  )?.sender;
  const currentParticipant = messages.find(
    (message) =>
      message.senderId === "me" || message.senderId === currentUserUid,
  )?.sender;
  const participantName =
    otherParticipant?.displayName ?? conversation?.recipientName ?? "Conversation";
  const contextTitle = formatContextTitle(conversation?.contextType);
  const participantAvatar =
    otherParticipant?.photoUrl ?? currentParticipant?.photoUrl ?? null;

  const handleSendMessage = async () => {
    const content = messageText.trim();
    if (!content || !conversationId || sendMessage.isPending) return;

    setSendError("");
    try {
      await sendMessage.mutateAsync({
        content,
        type: "text",
        replyToUid: replyTo?.id,
      });
      setMessageText("");
      setReplyTo(null);
    } catch (failure) {
      setSendError(
        failure instanceof Error
          ? failure.message
          : "Unable to send your message. Please try again.",
      );
    }
  };

  const showActionError = (failure: Error) => {
    setSendError(
      failure.message || "The message action failed. Please try again.",
    );
  };

  const toggleMessageSelection = (messageId: string) => {
    setSelectedMessageIds((current) =>
      current.includes(messageId)
        ? current.filter((id) => id !== messageId)
        : [...current, messageId],
    );
  };

  const showConversationOptions = () => {
    setDialog({
      title: "Conversation options",
      actions: [
      {
        label: "Delete conversation",
        destructive: true,
        onPress: () => {
          setDialog({
            title: "Delete conversation?",
            message: "This will hide the conversation from your inbox.",
            actions: [
              { label: "Cancel", onPress: () => {} },
              {
                label: "Delete",
                destructive: true,
                onPress: () =>
                  deleteConversation.mutate(conversationId, {
                    onSuccess: () => router.back(),
                    onError: showActionError,
                  }),
              },
            ],
          });
        },
      },
      { label: "Cancel", onPress: () => {} },
      ],
    });
  };

  const confirmDeleteMessages = () => {
    if (selectedMessageIds.length === 0) return;
    const messageIds = [...selectedMessageIds];
    setDialog({
      title: `Delete ${messageIds.length} message${messageIds.length === 1 ? "" : "s"}?`,
      message: "Deleted messages will be removed from this conversation.",
      actions: [
        { label: "Cancel", onPress: () => {} },
        {
          label: "Delete",
          destructive: true,
          onPress: () => {
            deleteMessages.mutate(messageIds, {
              onSuccess: () => setSelectedMessageIds([]),
              onError: showActionError,
            });
          },
        },
      ],
    });
  };

  const handleMessagePress = (message: Message) => {
    if (longPressedMessageId.current === message.id) {
      longPressedMessageId.current = null;
      return;
    }
    if (selectedMessageIds.length > 0) {
      toggleMessageSelection(message.id);
      return;
    }
    if (message.type === "system" || message.senderId === null) return;

    setDialog({
      title: "Message actions",
      actions: [
        { label: "Reply", onPress: () => setReplyTo(message) },
        ...["👍", "❤️", "😂", "😮"].map((emoji) => ({
          label: emoji,
          onPress: () =>
            reactToMessage.mutate(
              { messageUid: message.id, emoji },
              { onError: showActionError },
            ),
        })),
        { label: "Select", onPress: () => setSelectedMessageIds([message.id]) },
      ],
    });
  };

  const handleMessageLongPress = (message: Message) => {
    if (message.type === "system" || message.senderId === null) return;
    longPressedMessageId.current = message.id;
    toggleMessageSelection(message.id);
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.screen,
        { paddingTop: getTopSafeAreaInset(insets.top) },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ChatDetailHeader
        participantName={participantName}
        contextTitle={contextTitle}
        selectedCount={selectedMessageIds.length}
        isDeleting={deleteMessages.isPending}
        onBack={() => router.back()}
        onCancelSelection={() => setSelectedMessageIds([])}
        onDeleteSelected={confirmDeleteMessages}
        onOptions={showConversationOptions}
      />

      <ChatMessagesPanel
        messages={messages}
        conversationId={conversation?.msgId ?? conversationId}
        contextTitle={contextTitle}
        currentUserUid={currentUserUid}
        participantName={participantName}
        participantAvatar={participantAvatar}
        currentUserAvatar={currentParticipant?.photoUrl ?? null}
        selectedMessageIds={selectedMessageIds}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => refetch()}
        onMessagePress={handleMessagePress}
        onMessageLongPress={handleMessageLongPress}
      />

      <ChatComposer
        messageText={messageText}
        onMessageTextChange={setMessageText}
        onSend={handleSendMessage}
        isSending={sendMessage.isPending}
        enabled={Boolean(conversationId)}
        error={sendError}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
        bottomPadding={Math.max(insets.bottom, 8)}
      />
      <MessageDialog
        visible={dialog !== null}
        title={dialog?.title ?? ""}
        message={dialog?.message}
        actions={dialog?.actions ?? []}
        onDismiss={() => setDialog(null)}
      />
    </KeyboardAvoidingView>
  );
}

function formatContextTitle(context?: string) {
  if (!context) return "Trip conversation";
  const normalized = context.toLowerCase();
  if (normalized.includes("request")) return "Request conversation";
  if (normalized.includes("trip")) return "Trip conversation";
  return `${capitalize(context)} conversation`;
}

function capitalize(value: string) {
  return value ? `${value[0].toUpperCase()}${value.slice(1)}` : value;
}

const styles = StyleSheet.create((theme) => ({
  screen: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
}));
