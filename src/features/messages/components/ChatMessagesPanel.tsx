import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type {
  ChatRequestOffer,
  ChatTripOrder,
  Message,
} from "../types/message.types";
import type { RequestAction } from "../../request/types/request";
import { useChatMessageListScroll } from "../hooks/useChatMessageListScroll";
import { ChatMessageRow } from "./ChatMessageRow";
import { ConversationSummaryCard } from "./ConversationSummaryCard";

type ChatListItem =
  | { kind: "date"; id: string; label: string }
  | { kind: "message"; id: string; message: Message };

interface ChatMessagesPanelProps {
  messages: Message[];
  conversationId: string;
  contextTitle: string;
  currentUserUid: string;
  requestUid?: string;
  requesterUid?: string;
  orderDriverUid?: string;
  requestOffers: ChatRequestOffer[];
  tripOrder?: ChatTripOrder;
  respondingOffer?: { uid: string; action: RequestAction };
  respondingOrder?: { uid: string; action: RequestAction };
  canConfirmDelivery: boolean;
  isConfirmingDelivery: boolean;
  deliveryConfirmed: boolean;
  onOfferAction: (offerUid: string, action: RequestAction) => void;
  onOrderAction: (orderUid: string, action: RequestAction) => void;
  onConfirmDelivery: (requestUid: string) => void;
  selectedMessageIds: string[];
  selectionMode: boolean;
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  onRetry: () => void;
  onMessagePress: (message: Message) => void;
  onMessageLongPress: (message: Message) => void;
  onMessageDoubleTap: (message: Message) => void;
  onMessageSwipeReply: (message: Message) => void;
  onInteractionAreaTouch: () => void;
}

export function ChatMessagesPanel({
  messages,
  conversationId,
  contextTitle,
  currentUserUid,
  requestUid,
  requesterUid,
  orderDriverUid,
  requestOffers,
  tripOrder,
  respondingOffer,
  respondingOrder,
  canConfirmDelivery,
  isConfirmingDelivery,
  deliveryConfirmed,
  onOfferAction,
  onOrderAction,
  onConfirmDelivery,
  selectedMessageIds,
  selectionMode,
  isLoading,
  isError,
  error,
  onRetry,
  onMessagePress,
  onMessageLongPress,
  onMessageDoubleTap,
  onMessageSwipeReply,
  onInteractionAreaTouch,
}: ChatMessagesPanelProps) {
  const { theme } = useUnistyles();
  const items = useMemo(() => buildChatItems(messages), [messages]);
  const { listRef, onScroll, onLayout, onContentSizeChange } =
    useChatMessageListScroll<ChatListItem>();

  const renderItem = ({ item }: { item: ChatListItem }) => {
    if (item.kind === "date") {
      return (
        <View style={styles.dateSeparator}>
          <Text style={styles.dateLabel}>{item.label}</Text>
        </View>
      );
    }

    const message = item.message;
    const replyMessage = message.replyToUid
      ? messages.find((candidate) => candidate.id === message.replyToUid)
      : undefined;
    const requestOffer = findRequestOffer(message, requestUid, requestOffers);
    const matchedTripOrder =
      message.tripOrderUid
        ? tripOrder?.uid === message.tripOrderUid
          ? tripOrder
          : {
              uid: message.tripOrderUid,
              status: "sent",
              driverUid: message.tripOrderDriverUid ?? "",
            }
        : undefined;

    return (
      <ChatMessageRow
        message={message}
        replyMessage={replyMessage}
        currentUserUid={currentUserUid}
        selected={selectedMessageIds.includes(message.id)}
        selectionMode={selectionMode}
        requestOffer={requestOffer}
        tripOrder={matchedTripOrder}
        showRequestOfferActions={Boolean(
          currentUserUid && requesterUid && currentUserUid === requesterUid,
        )}
        showTripOrderActions={
          Boolean(
            currentUserUid &&
              orderDriverUid &&
              currentUserUid === orderDriverUid,
          )
        }
        isRespondingToOffer={Boolean(
          requestOffer && respondingOffer?.uid === requestOffer.uid,
        )}
        respondingOfferAction={respondingOffer?.action}
        isRespondingToOrder={Boolean(
          matchedTripOrder && respondingOrder?.uid === matchedTripOrder.uid,
        )}
        respondingOrderAction={respondingOrder?.action}
        canConfirmDelivery={canConfirmDelivery}
        isConfirmingDelivery={isConfirmingDelivery}
        deliveryConfirmed={deliveryConfirmed}
        onOfferAction={onOfferAction}
        onOrderAction={onOrderAction}
        onConfirmDelivery={onConfirmDelivery}
        onPress={() => onMessagePress(message)}
        onLongPress={() => onMessageLongPress(message)}
        onDoubleTap={() => onMessageDoubleTap(message)}
        onSwipeReply={() => onMessageSwipeReply(message)}
      />
    );
  };

  return (
    <FlatList
      ref={listRef}
      style={styles.messageList}
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListHeaderComponent={
        <ConversationSummaryCard
          contextTitle={contextTitle}
        />
      }
      ListEmptyComponent={
        <View style={styles.emptyState}>
          {isLoading ? (
            <ActivityIndicator color={theme.colors.text} />
          ) : isError ? (
            <>
              <Text style={styles.emptyText}>
                {error instanceof Error
                  ? error.message
                  : "Could not load your messages."}
              </Text>
              <TouchableOpacity accessibilityRole="button" onPress={onRetry}>
                <Text style={styles.retryText}>Try Again</Text>
              </TouchableOpacity>
            </>
          ) : !conversationId ? (
            <Text style={styles.emptyText}>Conversation ID is missing.</Text>
          ) : (
            <Text style={styles.emptyText}>
              No messages yet. Send a message to start the conversation.
            </Text>
          )}
        </View>
      }
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      onTouchStart={onInteractionAreaTouch}
      onScroll={onScroll}
      onLayout={onLayout}
      onContentSizeChange={onContentSizeChange}
      scrollEventThrottle={16}
    />
  );
}

function findRequestOffer(
  message: Message,
  requestUid: string | undefined,
  offers: ChatRequestOffer[],
) {
  if (message.type !== "text") return;
  if (message.requestOffer) {
    if (requestUid && message.requestOffer.requestUid !== requestUid) return;
    const referencedOffer = offers.find(
      (offer) => offer.uid === message.requestOffer?.offerUid,
    );
    if (referencedOffer) return referencedOffer;
    return {
      uid: message.requestOffer.offerUid,
      driverUid: message.senderId ?? "",
      message: "",
      proposedLatestBy: "",
      status: "sent",
    };
  }

  const messageText = message.text.trimStart().toLowerCase();
  const isOfferNotice =
    messageText.startsWith("delivery offer") ||
    messageText.includes("proposed delivery by:") ||
    messageText.includes("accept this offer");
  if (!isOfferNotice) {
    return;
  }
  const matchingOffers = offers.filter(
    (offer) => offer.driverUid === message.senderId,
  );
  if (matchingOffers.length === 1) return matchingOffers[0];
}

function buildChatItems(messages: Message[]): ChatListItem[] {
  const items: ChatListItem[] = [];
  let previousDate = "";

  for (const message of messages) {
    const date = new Date(message.createdAt);
    const dateKey = Number.isNaN(date.getTime())
      ? message.createdAt
      : date.toDateString();
    if (dateKey !== previousDate) {
      items.push({
        kind: "date",
        id: `date-${dateKey}`,
        label: formatDateDivider(date),
      });
      previousDate = dateKey;
    }
    items.push({ kind: "message", id: message.id, message });
  }

  return items;
}

function formatDateDivider(date: Date) {
  if (Number.isNaN(date.getTime())) return "Earlier";
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return "Today";
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() === today.getFullYear() ? undefined : "numeric",
  });
}

const styles = StyleSheet.create((theme) => ({
  messageList: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  dateSeparator: {
    alignItems: "center",
    marginVertical: theme.spacing.xs,
  },
  dateLabel: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.sm,
    color: theme.colors.muted,
    fontSize: 11,
    overflow: "hidden",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
    padding: theme.spacing.lg,
  },
  emptyText: {
    color: theme.colors.muted,
    fontSize: 13,
    textAlign: "center",
  },
  retryText: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "700",
    marginTop: theme.spacing.sm,
  },
}));
