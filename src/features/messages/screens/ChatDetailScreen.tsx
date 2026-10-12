import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getAuthSession } from "../../auth/services/authStorage";
import {
  useConversationMessages,
  useListMessages,
  useMarkConversationAsRead,
  useSendConversationMessage,
} from "../hooks/useMessages";
import { useChatMessageInteractions } from "../hooks/useChatMessageInteractions";
import { MessageDialog } from "../components/MessageDialog";
import { ChatComposer } from "../components/ChatComposer";
import { ChatMessagesPanel } from "../components/ChatMessagesPanel";
import { ChatDetailHeader } from "../components/ChatDetailHeader";
import { SelectedMessageReactions } from "../components/SelectedMessageReactions";
import type {
  ChatRequestOffer,
  ChatTripOrder,
  InboxMessage,
} from "../types/message.types";
import { getTopSafeAreaInset } from "../../../shared/utils/safeArea";
import { styles } from "../components/chatDetailScreen.styles";

interface ChatDetailScreenProps {
  requestUid?: string;
  requesterUid?: string;
  requestOffers?: ChatRequestOffer[];
  tripOrder?: ChatTripOrder;
  orderDriverUid?: string;
  isAcceptingOffer?: boolean;
  isAcceptingOrder?: boolean;
  onAcceptOffer?: (offerUid: string) => Promise<void>;
  onAcceptOrder?: (orderUid: string) => Promise<void>;
}

export function ChatDetailScreen({
  requestUid,
  requesterUid,
  requestOffers = [],
  tripOrder,
  orderDriverUid,
  isAcceptingOffer = false,
  isAcceptingOrder = false,
  onAcceptOffer,
  onAcceptOrder,
}: ChatDetailScreenProps = {}) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id: routeId, recipientName: routeRecipientName } =
    useLocalSearchParams<{ id?: string; recipientName?: string }>();
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
  const interactions = useChatMessageInteractions(conversationId);
  const markConversationRead = markAsRead.mutate;

  const [messageText, setMessageText] = useState("");
  const [currentUserUid, setCurrentUserUid] = useState("");
  const {
    replyTo,
    setReplyTo,
    selectedMessageIds,
    setSelectedMessageIds,
    showReactionPicker,
    dialog,
    setDialog,
  } = interactions;

  useFocusEffect(
    useCallback(() => {
      if (!conversationId) return;
      markConversationRead(conversationId, {
        onError: (failure) =>
          interactions.setError(
            failure instanceof Error
              ? failure.message
              : "Unable to mark conversation as read.",
          ),
      });
    }, [conversationId, interactions.setError, markConversationRead]),
  );

  useEffect(() => {
    let isActive = true;
    getAuthSession()
      .then((session) => {
        if (isActive) setCurrentUserUid(session?.user.id ?? "");
      })
      .catch((failure: unknown) => {
        if (isActive) {
          interactions.setError(
            failure instanceof Error
              ? failure.message
              : "Could not identify the current user.",
          );
        }
      });
    return () => {
      isActive = false;
    };
  }, [interactions.setError]);

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
    otherParticipant?.displayName ??
    conversation?.recipientName ??
    routeRecipientName ??
    "Conversation";
  const contextTitle = formatContextTitle(conversation?.contextType);
  const participantAvatar =
    otherParticipant?.photoUrl ?? currentParticipant?.photoUrl ?? null;
  const effectiveRequestUid = requestUid || conversation?.requestId || "";

  const handleSendMessage = async () => {
    const content = messageText.trim();
    if (!content || !conversationId || sendMessage.isPending) return;

    interactions.setError("");
    try {
      await sendMessage.mutateAsync({
        content,
        type: "text",
        replyToUid: replyTo?.id,
      });
      setMessageText("");
      setReplyTo(null);
    } catch (failure) {
      interactions.setError(
        failure instanceof Error
          ? failure.message
          : "Unable to send your message. Please try again.",
      );
    }
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
        isDeleting={interactions.isDeletingMessages}
        onBack={() => router.back()}
        onCancelSelection={() => setSelectedMessageIds([])}
        onDeleteSelected={interactions.confirmDeleteMessages}
        onOptions={interactions.showConversationOptions}
      />
      {showReactionPicker ? (
        <SelectedMessageReactions
          disabled={interactions.isReactingToMessages}
          onReact={interactions.reactToSelectedMessages}
        />
      ) : null}

      <ChatMessagesPanel
        messages={messages}
        conversationId={conversation?.msgId ?? conversationId}
        contextTitle={contextTitle}
        currentUserUid={currentUserUid}
        participantName={participantName}
        participantAvatar={participantAvatar}
        currentUserAvatar={currentParticipant?.photoUrl ?? null}
        requestUid={effectiveRequestUid}
        requesterUid={requesterUid}
        orderDriverUid={orderDriverUid}
        requestOffers={requestOffers}
        tripOrder={tripOrder}
        isAcceptingOffer={isAcceptingOffer}
        isAcceptingOrder={isAcceptingOrder}
        onAcceptOffer={(offerUid) => {
          if (!onAcceptOffer) return;
          void onAcceptOffer(offerUid)
            .then(() => {
              setDialog({
                title: "Offer accepted",
                message: "The request has been assigned to this driver.",
                actions: [{ label: "OK", onPress: () => {} }],
              });
            })
            .catch((failure: unknown) => {
              interactions.setError(
                failure instanceof Error
                  ? failure.message
                  : "Unable to accept this offer. Please try again.",
              );
            });
        }}
        onAcceptOrder={(orderUid) => {
          if (!onAcceptOrder) return;
          void onAcceptOrder(orderUid)
            .then(() => {
              setDialog({
                title: "Order accepted",
                message: "The order is now assigned to you.",
                actions: [{ label: "OK", onPress: () => {} }],
              });
            })
            .catch((failure: unknown) => {
              interactions.setError(
                failure instanceof Error
                  ? failure.message
                  : "Unable to accept this order. Please try again.",
              );
            });
        }}
        selectedMessageIds={selectedMessageIds}
        selectionMode={selectedMessageIds.length > 0}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => refetch()}
        onMessagePress={interactions.handleMessagePress}
        onMessageLongPress={interactions.handleMessageLongPress}
        onMessageDoubleTap={interactions.handleMessageDoubleTap}
        onMessageSwipeReply={setReplyTo}
        onInteractionAreaTouch={interactions.dismissReactionPicker}
      />

      <ChatComposer
        messageText={messageText}
        onMessageTextChange={setMessageText}
        onSend={handleSendMessage}
        isSending={sendMessage.isPending}
        enabled={Boolean(conversationId)}
        error={interactions.error}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
        bottomPadding={Math.max(insets.bottom, 8)}
      />
      <MessageDialog
        visible={dialog !== null}
        title={dialog?.title ?? ""}
        message={dialog?.message}
        actions={dialog?.actions ?? []}
        onDismiss={interactions.dismissDialog}
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
