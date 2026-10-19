import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";

import { parseSharedDetailLink } from "../../../shared/utils/sharedDetailLink";
import { MessageGesturePressable } from "./MessageGesturePressable";
import type {
  ChatRequestOffer,
  ChatTripOrder,
  Message,
} from "../types/message.types";
import type { RequestAction } from "../../request/types/request";
import { RequestOfferMessageCard } from "./RequestOfferMessageCard";
import { SystemChatNotice } from "./SystemChatNotice";
import { TripOrderMessageCard } from "./TripOrderMessageCard";
import { DeliveryProofMessageCard } from "./DeliveryProofMessageCard";
import { SwipeToReplyMessage } from "./SwipeToReplyMessage";
import { ChatMessageMedia } from "./ChatMessageMedia";
import { styles } from "./chatMessageRow.styles";

interface ChatMessageRowProps {
  message: Message;
  replyMessage?: Message;
  currentUserUid: string;
  selected: boolean;
  selectionMode: boolean;
  requestOffer?: ChatRequestOffer;
  tripOrder?: ChatTripOrder;
  showRequestOfferActions: boolean;
  showTripOrderActions: boolean;
  isRespondingToOffer: boolean;
  respondingOfferAction?: RequestAction;
  isRespondingToOrder: boolean;
  respondingOrderAction?: RequestAction;
  canConfirmDelivery: boolean;
  isConfirmingDelivery: boolean;
  deliveryConfirmed: boolean;
  onOfferAction: (offerUid: string, action: RequestAction) => void;
  onOrderAction: (orderUid: string, action: RequestAction) => void;
  onConfirmDelivery: (requestUid: string) => void;
  onPress: () => void;
  onLongPress: () => void;
  onDoubleTap: () => void;
  onSwipeReply: () => void;
}

export function ChatMessageRow({
  message,
  replyMessage,
  currentUserUid,
  selected,
  selectionMode,
  requestOffer,
  tripOrder,
  showRequestOfferActions,
  showTripOrderActions,
  isRespondingToOffer,
  respondingOfferAction,
  isRespondingToOrder,
  respondingOrderAction,
  canConfirmDelivery,
  isConfirmingDelivery,
  deliveryConfirmed,
  onOfferAction,
  onOrderAction,
  onConfirmDelivery,
  onPress,
  onLongPress,
  onDoubleTap,
  onSwipeReply,
}: ChatMessageRowProps) {
  const router = useRouter();
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
      : message.type === "image"
        ? "Photo"
        : message.type === "voice"
          ? "Voice message"
          : `${capitalize(message.type)} message`;
  const sharedTarget =
    message.type === "text" ? parseSharedDetailLink(message.text) : null;
  const reactions = getReactionCounts(message.reactions);
  return (
    <SwipeToReplyMessage enabled={!selectionMode} onReply={onSwipeReply}>
      <View
        style={[
          styles.messageRow,
          isMine ? styles.messageRowMine : styles.messageRowOther,
        ]}
      >
        <View
          style={[
            styles.messageColumn,
            isMine ? styles.messageColumnMine : styles.messageColumnOther,
            requestOffer && styles.messageColumnOffer,
          ]}
        >
          {message.deliveryProof && tripOrder ? (
            <DeliveryProofMessageCard
              proof={message.deliveryProof}
              order={tripOrder}
              canConfirm={canConfirmDelivery}
              isConfirmed={
                deliveryConfirmed ||
                ["completed", "confirmed"].includes(
                  tripOrder.status.toLowerCase(),
                )
              }
              isConfirming={isConfirmingDelivery}
              onConfirm={() => onConfirmDelivery(tripOrder.uid)}
            />
          ) : tripOrder ? (
            <TripOrderMessageCard
              order={tripOrder}
              message={messageText}
              showActions={showTripOrderActions}
              isResponding={isRespondingToOrder}
              respondingAction={respondingOrderAction}
              selected={selected}
              selectionMode={selectionMode}
              onPress={onPress}
              onLongPress={onLongPress}
              onDoubleTap={onDoubleTap}
              onAction={(action) => onOrderAction(tripOrder.uid, action)}
            />
          ) : requestOffer ? (
            <RequestOfferMessageCard
              offer={requestOffer}
              showActions={showRequestOfferActions}
              isResponding={isRespondingToOffer}
              respondingAction={respondingOfferAction}
              selected={selected}
              selectionMode={selectionMode}
              onPress={onPress}
              onLongPress={onLongPress}
              onDoubleTap={onDoubleTap}
              onAction={(action) => onOfferAction(requestOffer.uid, action)}
            />
          ) : (
            <MessageGesturePressable
              selectionMode={selectionMode}
              accessibilityLabel={
                selected ? "Deselect message" : "Select message"
              }
              onPress={onPress}
              onLongPress={onLongPress}
              onDoubleTap={onDoubleTap}
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
              {message.type === "image" || message.type === "voice" ? (
                message.mediaUrl ? (
                  <ChatMessageMedia
                    type={message.type}
                    uri={message.mediaUrl}
                  />
                ) : (
                  <Text style={styles.messageText}>
                    {messageText} unavailable
                  </Text>
                )
              ) : (
                <Text style={styles.messageText}>{messageText}</Text>
              )}
              <View style={styles.messageMeta}>
                <Text style={styles.messageTime}>
                  {formatTime(message.createdAt)}
                </Text>
                {isMine ? (
                  <MaterialCommunityIcons
                    name={message.isRead ? "check-all" : "check"}
                    size={12}
                    color={
                      message.isRead ? theme.colors.primary : theme.colors.muted
                    }
                    accessibilityLabel={message.isRead ? "Read" : "Sent"}
                  />
                ) : null}
              </View>
              {selected ? (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={15}
                  color={theme.colors.text}
                  style={styles.selectedMark}
                />
              ) : null}
            </MessageGesturePressable>
          )}
          {sharedTarget ? (
            <MessageGesturePressable
              selectionMode={selectionMode}
              accessibilityLabel={`Open shared ${sharedTarget.type}`}
              onPress={() => {
                if (selectionMode) {
                  onPress();
                  return;
                }
                router.push({
                  pathname:
                    sharedTarget.type === "trip"
                      ? "/shared/trip/[uid]"
                      : "/shared/request/[uid]",
                  params: { uid: sharedTarget.uid },
                });
              }}
              onLongPress={onLongPress}
              onDoubleTap={() => undefined}
              style={styles.sharedLinkButton}
            >
              <MaterialCommunityIcons
                name="open-in-new"
                size={15}
                color={theme.colors.text}
              />
              <Text style={styles.sharedLinkText}>
                Open shared {sharedTarget.type}
              </Text>
            </MessageGesturePressable>
          ) : null}
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
          {message.deliveryProof || tripOrder || requestOffer ? (
            <View style={styles.messageMeta}>
              <Text style={styles.messageTime}>
                {formatTime(message.createdAt)}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </SwipeToReplyMessage>
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
