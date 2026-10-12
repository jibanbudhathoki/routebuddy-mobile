import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, Text, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";

import { MessageGesturePressable } from "./MessageGesturePressable";
import type {
  ChatRequestOffer,
  ChatTripOrder,
  Message,
} from "../types/message.types";
import { RequestOfferMessageCard } from "./RequestOfferMessageCard";
import { SystemChatNotice } from "./SystemChatNotice";
import { TripOrderMessageCard } from "./TripOrderMessageCard";
import { SwipeToReplyMessage } from "./SwipeToReplyMessage";
import { ChatMessageMedia } from "./ChatMessageMedia";
import { styles } from "./chatMessageRow.styles";

interface ChatMessageRowProps {
  message: Message;
  replyMessage?: Message;
  currentUserUid: string;
  otherParticipantUid: string;
  participantName: string;
  participantAvatar: string | null;
  currentUserAvatar: string | null;
  selected: boolean;
  selectionMode: boolean;
  requestOffer?: ChatRequestOffer;
  tripOrder?: ChatTripOrder;
  showRequestOfferActions: boolean;
  showTripOrderActions: boolean;
  isAcceptingOffer: boolean;
  isAcceptingOrder: boolean;
  onAcceptOffer: (offerUid: string) => void;
  onAcceptOrder: (orderUid: string) => void;
  onPress: () => void;
  onLongPress: () => void;
  onDoubleTap: () => void;
  onSwipeReply: () => void;
}

export function ChatMessageRow({
  message,
  replyMessage,
  currentUserUid,
  otherParticipantUid,
  participantName,
  participantAvatar,
  currentUserAvatar,
  selected,
  selectionMode,
  requestOffer,
  tripOrder,
  showRequestOfferActions,
  showTripOrderActions,
  isAcceptingOffer,
  isAcceptingOrder,
  onAcceptOffer,
  onAcceptOrder,
  onPress,
  onLongPress,
  onDoubleTap,
  onSwipeReply,
}: ChatMessageRowProps) {
  const { theme } = useUnistyles();

  if (message.type === "system" || message.senderId === null) {
    return <SystemChatNotice message={message} />;
  }

  const isMine =
    message.senderId === "me" ||
    (Boolean(currentUserUid) && message.senderId === currentUserUid);
  const isReadByRecipient =
    isMine &&
    Boolean(otherParticipantUid) &&
    message.readBy?.includes(otherParticipantUid) === true;
  const messageText =
    message.type === "text"
      ? message.text
      : message.type === "image"
        ? "Photo"
        : message.type === "voice"
          ? "Voice message"
          : `${capitalize(message.type)} message`;
  const reactions = getReactionCounts(message.reactions);
  const avatarUrl = message.sender?.photoUrl ?? participantAvatar;
  const name = message.sender?.displayName ?? participantName;

  return (
    <SwipeToReplyMessage enabled={!selectionMode} onReply={onSwipeReply}>
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
          {tripOrder ? (
            <TripOrderMessageCard
              order={tripOrder}
              message={messageText}
              showActions={showTripOrderActions}
              isAccepting={isAcceptingOrder}
              selected={selected}
              selectionMode={selectionMode}
              onPress={onPress}
              onLongPress={onLongPress}
              onDoubleTap={onDoubleTap}
              onAccept={() => onAcceptOrder(tripOrder.uid)}
            />
          ) : requestOffer ? (
            <RequestOfferMessageCard
              offer={requestOffer}
              showActions={showRequestOfferActions}
              isAccepting={isAcceptingOffer}
              selected={selected}
              selectionMode={selectionMode}
              onPress={onPress}
              onLongPress={onLongPress}
              onDoubleTap={onDoubleTap}
              onAccept={() => onAcceptOffer(requestOffer.uid)}
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
              {selected ? (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={15}
                  color={theme.colors.primary}
                  style={styles.selectedMark}
                />
              ) : null}
            </MessageGesturePressable>
          )}
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
            <Text style={styles.messageTime}>
              {formatTime(message.createdAt)}
            </Text>
            {isMine ? (
              <MaterialCommunityIcons
                name={isReadByRecipient ? "check-all" : "check"}
                size={13}
                color={isReadByRecipient ? theme.colors.primary : theme.colors.muted}
              />
            ) : null}
          </View>
        </View>
        {isMine ? <Avatar uri={currentUserAvatar} name="You" small /> : null}
      </View>
    </SwipeToReplyMessage>
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
