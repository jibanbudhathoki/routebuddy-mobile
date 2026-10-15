import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { MessageGesturePressable } from "./MessageGesturePressable";
import type { ChatTripOrder } from "../types/message.types";

interface TripOrderMessageCardProps {
  order: ChatTripOrder;
  message: string;
  showActions: boolean;
  isAccepting: boolean;
  selected: boolean;
  selectionMode: boolean;
  onPress: () => void;
  onLongPress: () => void;
  onDoubleTap: () => void;
  onAccept: () => void;
}

export function TripOrderMessageCard({
  order,
  message,
  showActions,
  isAccepting,
  selected,
  selectionMode,
  onPress,
  onLongPress,
  onDoubleTap,
  onAccept,
}: TripOrderMessageCardProps) {
  const { theme } = useUnistyles();
  const [isRejected, setIsRejected] = useState(false);
  const displayStatus = isRejected ? "Rejected" : order.status;
  const canRespond = ![
    "accepted",
    "cancelled",
    "canceled",
    "completed",
    "delivered",
    "rejected",
  ].includes(order.status.toLowerCase()) && !isRejected;

  return (
    <View style={[styles.card, selected && styles.selectedCard]}>
      <MessageGesturePressable
        selectionMode={selectionMode}
        accessibilityLabel={selected ? "Deselect order message" : "Order message"}
        onPress={onPress}
        onLongPress={onLongPress}
        onDoubleTap={onDoubleTap}
      >
        <View style={styles.heading}>
          <MaterialCommunityIcons
            name="clipboard-list-outline"
            size={18}
            color={theme.colors.primary}
          />
          <Text style={styles.title}>Shopping order</Text>
          <Text style={styles.status}>{displayStatus}</Text>
        </View>
        <Text style={styles.message}>{message}</Text>
      </MessageGesturePressable>
      {showActions && canRespond ? (
        <>
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Accept shopping order"
              disabled={isAccepting}
              onPress={onAccept}
              style={[
                styles.acceptButton,
                isAccepting && styles.disabledButton,
              ]}
            >
              {isAccepting ? (
                <ActivityIndicator
                  size="small"
                  color={theme.colors.onPrimary}
                />
              ) : (
                <MaterialCommunityIcons
                  name="check"
                  size={16}
                  color={theme.colors.onPrimary}
                />
              )}
              <Text style={styles.acceptText}>
                {isAccepting ? "Accepting..." : "Accept order"}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: isAccepting }}
              disabled={isAccepting}
              onPress={() => setIsRejected(true)}
              style={styles.rejectButton}
            >
              <MaterialCommunityIcons
                name="close"
                size={16}
                color={theme.colors.error}
              />
              <Text style={styles.rejectText}>Reject</Text>
            </Pressable>
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.sm,
  },
  selectedCard: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  heading: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  title: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
  },
  status: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  message: {
    color: theme.colors.text,
    fontSize: 12,
    lineHeight: 18,
    marginTop: theme.spacing.sm,
  },
  actions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  acceptButton: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    flex: 1,
    flexDirection: "row",
    gap: theme.spacing.xs,
    height: 40,
    justifyContent: "center",
  },
  acceptText: {
    color: theme.colors.onPrimary,
    fontSize: 12,
    fontWeight: "700",
  },
  rejectButton: {
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: theme.spacing.xs,
    height: 40,
    justifyContent: "center",
  },
  rejectText: {
    color: theme.colors.error,
    fontSize: 12,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.65,
  },
}));
