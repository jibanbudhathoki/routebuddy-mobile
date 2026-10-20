import { Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { MessageRequestCard } from "./MessageRequestCard";
import type { ChatRequestOffer } from "../types/message.types";
import type { RequestAction } from "../../request/types/request";

interface RequestOfferMessageCardProps {
  offer: ChatRequestOffer;
  message: string;
  createdAt: string;
  isMine: boolean;
  isRead?: boolean;
  showActions: boolean;
  isResponding: boolean;
  respondingAction?: RequestAction;
  selected: boolean;
  selectionMode: boolean;
  onPress: () => void;
  onLongPress: () => void;
  onDoubleTap: () => void;
  onAction: (action: RequestAction) => void;
}

export function RequestOfferMessageCard({
  offer,
  message,
  createdAt,
  isMine,
  isRead,
  showActions,
  isResponding,
  respondingAction,
  selected,
  selectionMode,
  onPress,
  onLongPress,
  onDoubleTap,
  onAction,
}: RequestOfferMessageCardProps) {
  const { theme } = useUnistyles();
  const status = offer.status || "sent";
  const normalizedStatus = status.toLowerCase();
  const canRespond = ["pending", "open"].includes(normalizedStatus);
  const date = offer.proposedLatestBy
    ? new Date(offer.proposedLatestBy)
    : undefined;
  const proposedDate =
    date && !Number.isNaN(date.getTime())
      ? date.toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : undefined;
  const statusMessage = canRespond
    ? showActions
      ? "Review this offer and choose whether to accept or reject it."
      : "This offer is waiting for the requester’s response."
    : normalizedStatus === "accepted"
      ? "This offer was accepted and the driver is assigned to the request."
      : normalizedStatus === "rejected"
        ? "This offer was declined."
        : "Offer details and updates are available in this conversation.";
  const offerMessage = offer.message.trim();

  return (
    <MessageRequestCard
      title="Delivery offer"
      icon="package-variant"
      status={status}
      statusMessage={statusMessage}
      createdAt={createdAt}
      isMine={isMine}
      isRead={isRead}
      canRespond={canRespond}
      showActions={showActions}
      isResponding={isResponding}
      respondingAction={respondingAction}
      selected={selected}
      selectionMode={selectionMode}
      onPress={onPress}
      onLongPress={onLongPress}
      onDoubleTap={onDoubleTap}
      onAction={onAction}
    >
      {proposedDate ? (
        <View style={styles.proposedTime}>
          <Text style={styles.label}>Proposed delivery by</Text>
          <Text style={styles.value}>{proposedDate}</Text>
        </View>
      ) : null}
      {offerMessage ? (
        <View style={styles.messageBlock}>
          <Text style={styles.label}>Driver’s message</Text>
          <Text style={styles.message}>{offerMessage}</Text>
        </View>
      ) : message.trim() ? (
        <Text style={styles.message}>{message.trim()}</Text>
      ) : null}
    </MessageRequestCard>
  );
}

const styles = StyleSheet.create((theme) => ({
  proposedTime: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.sm,
    gap: 2,
    padding: theme.spacing.sm,
  },
  label: {
    color: theme.colors.muted,
    fontSize: 10,
  },
  value: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "600",
  },
  messageBlock: {
    gap: 3,
  },
  message: {
    color: theme.colors.text,
    fontSize: 12,
    lineHeight: 17,
  },
}));
