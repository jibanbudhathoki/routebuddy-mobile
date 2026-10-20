import { Text } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { MessageRequestCard } from "./MessageRequestCard";
import type { ChatTripOrder } from "../types/message.types";
import type { RequestAction } from "../../request/types/request";

interface TripOrderMessageCardProps {
  order: ChatTripOrder;
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

export function TripOrderMessageCard({
  order,
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
}: TripOrderMessageCardProps) {
  const normalizedStatus = order.status.toLowerCase();
  const canRespond = ["pending", "open"].includes(normalizedStatus);
  const statusMessage = canRespond
    ? showActions
      ? "Review this order and choose whether to accept or reject it."
      : "This order is waiting for the driver’s response."
    : normalizedStatus === "accepted"
      ? "This order was accepted and assigned to a driver."
      : normalizedStatus === "rejected"
        ? "This order was declined."
        : "Order updates are available in this conversation.";

  return (
    <MessageRequestCard
      title="Shopping order"
      icon="clipboard-list-outline"
      status={order.status}
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
      <Text style={styles.message}>
        {message.trim() || "Shopping order details"}
      </Text>
    </MessageRequestCard>
  );
}

const styles = StyleSheet.create((theme) => ({
  message: {
    color: theme.colors.text,
    fontSize: 12,
    lineHeight: 18,
  },
}));
