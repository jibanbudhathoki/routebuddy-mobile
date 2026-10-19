import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getAuthSession } from "../../auth/services/authStorage";
import {
  useConversationMessages,
  useListMessages,
  useSendConversationMessage,
} from "../hooks/useMessages";
import { useChatMessageInteractions } from "../hooks/useChatMessageInteractions";
import { useChatMedia } from "../hooks/useChatMedia";
import { useChatRequestActions } from "../hooks/useChatRequestActions";
import { MessageDialog } from "../components/MessageDialog";
import { ChatComposer } from "../components/ChatComposer";
import { ChatMessagesPanel } from "../components/ChatMessagesPanel";
import { ChatDetailHeader } from "../components/ChatDetailHeader";
import { RequestStatusTimeline } from "../../request/components/RequestStatusTimeline";
import type {
  RequestAction,
  RequestDetailsResponse,
} from "../../request/types/request";
import { SelectedMessageReactions } from "../components/SelectedMessageReactions";
import type {
  ChatRequestOffer,
  ChatTripOrder,
  InboxMessage,
} from "../types/message.types";
import { formatContextTitle } from "../utils/formatContextTitle";
import { getTopSafeAreaInset } from "../../../shared/utils/safeArea";
import { resolveAvatarUrl } from "../utils/resolveAvatarUrl";
import { styles } from "../components/chatDetailScreen.styles";

interface RespondingItem {
  uid: string;
  action: RequestAction;
}

interface ChatDetailScreenProps {
  requestUid?: string;
  request?: RequestDetailsResponse;
  requesterUid?: string;
  requestOffers?: ChatRequestOffer[];
  tripOrder?: ChatTripOrder;
  orderDriverUid?: string;
  respondingOffer?: RespondingItem;
  respondingOrder?: RespondingItem;
  isConfirmingDelivery?: boolean;
  onOfferAction?: (
    offerUid: string,
    action: RequestAction,
  ) => Promise<void>;
  onOrderAction?: (
    orderUid: string,
    action: RequestAction,
  ) => Promise<void>;
  onConfirmDelivery?: (requestUid: string) => Promise<void>;
  onDeliveryConfirmed?: () => void;
}

export function ChatDetailScreen({
  requestUid,
  request,
  requesterUid,
  requestOffers = [],
  tripOrder,
  orderDriverUid,
  respondingOffer,
  respondingOrder,
  isConfirmingDelivery = false,
  onOfferAction,
  onOrderAction,
  onConfirmDelivery,
  onDeliveryConfirmed,
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
  const interactions = useChatMessageInteractions(conversationId);
  const media = useChatMedia({
    conversationId,
    replyToUid: interactions.replyTo?.id,
    onSent: () => {
      interactions.setError("");
      interactions.setReplyTo(null);
    },
    onError: (failure) => interactions.setError(failure.message),
  });
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
  const otherParticipantMessage = messages.find(
    (message) =>
      message.senderId &&
      message.senderId !== "me" &&
      message.senderId !== currentUserUid,
  );
  const otherParticipant = otherParticipantMessage?.sender;
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
  const requestParticipantAvatar =
    currentUserUid && currentUserUid === request?.requester.uid
      ? request?.driver?.photoUrl
      : request?.requester.photoUrl;
  const participantAvatar = resolveAvatarUrl(
    otherParticipant?.photoUrl ??
      requestParticipantAvatar ??
      conversation?.avatarUrl,
  );
  const effectiveRequestUid = requestUid || conversation?.requestId || "";
  const requestActions = useChatRequestActions({
    requestUid: effectiveRequestUid,
    onOfferAction,
    onOrderAction,
    onConfirmDelivery,
    onDeliveryConfirmed,
    setDialog,
    setError: interactions.setError,
  });

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
    <View
      style={[
        styles.screen,
        { paddingTop: getTopSafeAreaInset(insets.top) },
      ]}
    >
      <ChatDetailHeader
        participantName={participantName}
        participantAvatar={participantAvatar}
        contextTitle={contextTitle}
        selectedCount={selectedMessageIds.length}
        isDeleting={interactions.isDeletingMessages}
        onBack={() => router.back()}
        onCancelSelection={() => setSelectedMessageIds([])}
        onDeleteSelected={interactions.confirmDeleteMessages}
        onOptions={interactions.showConversationOptions}
      />
      {request ? (
        <View style={styles.requestStatus}>
          <RequestStatusTimeline request={request} />
        </View>
      ) : null}
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
        requestUid={effectiveRequestUid}
        requesterUid={requesterUid}
        orderDriverUid={orderDriverUid}
        requestOffers={requestOffers}
        tripOrder={tripOrder}
        respondingOffer={respondingOffer}
        respondingOrder={respondingOrder}
        canConfirmDelivery={Boolean(
          requesterUid && currentUserUid === requesterUid,
        )}
        isConfirmingDelivery={isConfirmingDelivery}
        deliveryConfirmed={requestActions.deliveryConfirmed}
        onOfferAction={requestActions.onOfferAction}
        onOrderAction={requestActions.onOrderAction}
        onConfirmDelivery={requestActions.onConfirmDelivery}
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
        onPickImage={media.pickImage}
        onTakePhoto={media.takePhoto}
        onPickAudioFile={media.pickAudioFile}
        onVoiceMessage={media.stopAndSendVoiceRecording}
        isRecording={media.isRecording}
        isMediaBusy={media.isUploading}
        recordingDuration={media.recordingDuration}
      />
      <MessageDialog
        visible={dialog !== null}
        title={dialog?.title ?? ""}
        message={dialog?.message}
        actions={dialog?.actions ?? []}
        onDismiss={interactions.dismissDialog}
      />
    </View>
  );
}
