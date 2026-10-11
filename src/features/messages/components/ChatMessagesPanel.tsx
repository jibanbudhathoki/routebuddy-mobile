import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type {
  ChatRequestOffer,
  ChatTripOrder,
  Message,
} from "../types/message.types";
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
  participantName: string;
  participantAvatar: string | null;
  currentUserAvatar: string | null;
  requestUid?: string;
  requesterUid?: string;
  orderDriverUid?: string;
  requestOffers: ChatRequestOffer[];
  tripOrder?: ChatTripOrder;
  isAcceptingOffer: boolean;
  isAcceptingOrder: boolean;
  onAcceptOffer: (offerUid: string) => void;
  onAcceptOrder: (orderUid: string) => void;
  selectedMessageIds: string[];
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  onRetry: () => void;
  onMessagePress: (message: Message) => void;
  onMessageLongPress: (message: Message) => void;
}

export function ChatMessagesPanel({
  messages,
  conversationId,
  contextTitle,
  currentUserUid,
  participantName,
  participantAvatar,
  currentUserAvatar,
  requestUid,
  requesterUid,
  orderDriverUid,
  requestOffers,
  tripOrder,
  isAcceptingOffer,
  isAcceptingOrder,
  onAcceptOffer,
  onAcceptOrder,
  selectedMessageIds,
  isLoading,
  isError,
  error,
  onRetry,
  onMessagePress,
  onMessageLongPress,
}: ChatMessagesPanelProps) {
  const { theme } = useUnistyles();
  const items = useMemo(() => buildChatItems(messages), [messages]);

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
    const requestOffer = findRequestOffer(
      message,
      requestUid,
      requestOffers,
    );
    const matchedTripOrder =
      message.tripOrderUid
        ? tripOrder?.uid === message.tripOrderUid
          ? tripOrder
          : {
              uid: message.tripOrderUid,
              status: "pending",
              driverUid: message.tripOrderDriverUid ?? "",
            }
        : undefined;

    return (
      <ChatMessageRow
        message={message}
        replyMessage={replyMessage}
        currentUserUid={currentUserUid}
        participantName={participantName}
        participantAvatar={participantAvatar}
        currentUserAvatar={currentUserAvatar}
        selected={selectedMessageIds.includes(message.id)}
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
        isAcceptingOffer={isAcceptingOffer}
        isAcceptingOrder={isAcceptingOrder}
        onAcceptOffer={onAcceptOffer}
        onAcceptOrder={onAcceptOrder}
        onPress={() => onMessagePress(message)}
        onLongPress={() => onMessageLongPress(message)}
      />
    );
  };

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListHeaderComponent={
        <ConversationSummaryCard
          contextTitle={contextTitle}
          contextId={conversationId}
        />
      }
      ListEmptyComponent={
        <View style={styles.emptyState}>
          {isLoading ? (
            <ActivityIndicator color={theme.colors.primary} />
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
    />
  );
}

function findRequestOffer(
  message: Message,
  requestUid: string | undefined,
  offers: ChatRequestOffer[],
) {
  if (offers.length === 0 || message.type !== "text") return;
  if (
    message.requestOffer &&
    (!requestUid || message.requestOffer.requestUid === requestUid)
  ) {
    const referencedOffer = offers.find(
      (offer) => offer.uid === message.requestOffer?.offerUid,
    );
    if (referencedOffer) return referencedOffer;
  }

  const messageText = message.text.trimStart().toLowerCase();
  const isOfferNotice =
    messageText.startsWith("delivery offer") ||
    messageText.includes("proposed delivery by:") ||
    messageText.includes("accept this offer");
  if (!isOfferNotice) {
    return;
  }
  return offers.find(
    (offer) =>
      offer.driverUid === message.senderId &&
      offer.status.toLowerCase() === "pending",
  );
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
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: "700",
    marginTop: theme.spacing.sm,
  },
}));
