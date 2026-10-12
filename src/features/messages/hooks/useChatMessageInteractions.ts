import { useState } from "react";
import { useRouter } from "expo-router";

import { useDeleteConversation, useDeleteMessages, useReactToMessage } from "./useMessages";
import type { Message } from "../types/message.types";
import type { MessageDialogAction } from "../components/MessageDialog";

interface ChatDialogState {
  title: string;
  message?: string;
  actions: MessageDialogAction[];
}

export function useChatMessageInteractions(conversationId: string) {
  const router = useRouter();
  const deleteConversation = useDeleteConversation();
  const deleteMessages = useDeleteMessages(conversationId);
  const reactToMessage = useReactToMessage(conversationId);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [dialog, setDialog] = useState<ChatDialogState | null>(null);
  const [error, setError] = useState("");

  function showActionError(failure: Error) {
    setError(failure.message || "The message action failed. Please try again.");
  }

  function toggleMessageSelection(messageId: string) {
    setSelectedMessageIds((current) =>
      current.includes(messageId)
        ? current.filter((id) => id !== messageId)
        : [...current, messageId],
    );
  }

  function handleMessagePress(message: Message) {
    if (selectedMessageIds.length > 0) {
      const isSelected = selectedMessageIds.includes(message.id);
      const nextCount = selectedMessageIds.length + (isSelected ? -1 : 1);
      if (nextCount > 1) setShowReactionPicker(false);
      toggleMessageSelection(message.id);
    }
  }

  function handleMessageLongPress(message: Message) {
    if (message.type === "system" || message.senderId === null) return;
    if (selectedMessageIds.length === 0) setShowReactionPicker(true);
    else setShowReactionPicker(false);
    setSelectedMessageIds((current) =>
      current.includes(message.id) ? current : [...current, message.id],
    );
  }

  function dismissReactionPicker() {
    setShowReactionPicker(false);
  }

  function handleMessageDoubleTap(message: Message) {
    if (
      selectedMessageIds.length > 0 ||
      message.type === "system" ||
      message.senderId === null
    ) {
      return;
    }
    reactToMessage.mutate(
      { messageUid: message.id, emoji: "❤️" },
      { onError: showActionError },
    );
  }

  async function reactToSelectedMessages(emoji: string) {
    if (selectedMessageIds.length === 0 || reactToMessage.isPending) return;
    try {
      await Promise.all(
        selectedMessageIds.map((messageUid) =>
          reactToMessage.mutateAsync({ messageUid, emoji }),
        ),
      );
      setSelectedMessageIds([]);
    } catch (failure) {
      showActionError(
        failure instanceof Error
          ? failure
          : new Error("Unable to react to the selected messages."),
      );
    }
  }

  function showConversationOptions() {
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
  }

  function confirmDeleteMessages() {
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
          onPress: () =>
            deleteMessages.mutate(messageIds, {
              onSuccess: () => setSelectedMessageIds([]),
              onError: showActionError,
            }),
        },
      ],
    });
  }

  return {
    replyTo,
    setReplyTo,
    selectedMessageIds,
    setSelectedMessageIds,
    showReactionPicker:
      selectedMessageIds.length === 1 && showReactionPicker,
    dialog,
    setDialog,
    error,
    setError,
    isDeletingMessages: deleteMessages.isPending,
    isReactingToMessages: reactToMessage.isPending,
    handleMessagePress,
    handleMessageLongPress,
    dismissReactionPicker,
    handleMessageDoubleTap,
    reactToSelectedMessages,
    showConversationOptions,
    confirmDeleteMessages,
    dismissDialog: () => setDialog(null),
  };
}
