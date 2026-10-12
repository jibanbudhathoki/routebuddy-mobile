import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { MessageGesturePressable } from "./MessageGesturePressable";
import type { ChatRequestOffer } from "../types/message.types";

interface RequestOfferMessageCardProps {
  offer: ChatRequestOffer;
  showActions: boolean;
  isAccepting: boolean;
  selected: boolean;
  selectionMode: boolean;
  onPress: () => void;
  onLongPress: () => void;
  onDoubleTap: () => void;
  onAccept: () => void;
}

export function RequestOfferMessageCard({
  offer,
  showActions,
  isAccepting,
  selected,
  selectionMode,
  onPress,
  onLongPress,
  onDoubleTap,
  onAccept,
}: RequestOfferMessageCardProps) {
  const { theme } = useUnistyles();
  const date = new Date(offer.proposedLatestBy);
  const proposedDate = Number.isNaN(date.getTime())
    ? "Time not available"
    : date.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
  const isPending = offer.status.toLowerCase() === "pending";

  return (
    <View style={[styles.card, selected && styles.selectedCard]}>
      <MessageGesturePressable
        selectionMode={selectionMode}
        accessibilityLabel={selected ? "Deselect offer message" : "Offer message"}
        onPress={onPress}
        onLongPress={onLongPress}
        onDoubleTap={onDoubleTap}
      >
        <View style={styles.heading}>
          <MaterialCommunityIcons
            name="package-variant"
            size={18}
            color={theme.colors.primary}
          />
          <Text style={styles.title}>Delivery offer</Text>
          <Text style={styles.status}>{offer.status}</Text>
        </View>
        <View style={styles.proposedTime}>
          <Text style={styles.label}>Proposed delivery by</Text>
          <Text style={styles.value}>{proposedDate}</Text>
        </View>
        <View style={styles.messageBlock}>
          <Text style={styles.label}>Driver’s message</Text>
          <Text style={styles.message}>
            {offer.message.trim() || "No message provided."}
          </Text>
        </View>
      </MessageGesturePressable>
      {showActions && isPending ? (
        <>
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
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
                {isAccepting ? "Accepting..." : "Accept"}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: true }}
              disabled
              style={styles.rejectButton}
            >
              <MaterialCommunityIcons
                name="close"
                size={16}
                color={theme.colors.muted}
              />
              <Text style={styles.rejectText}>Reject</Text>
            </Pressable>
          </View>
          <Text style={styles.notice}>
            Reject is unavailable until the service supports declining an
            individual offer.
          </Text>
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
    opacity: 0.7,
  },
  rejectText: {
    color: theme.colors.muted,
    fontSize: 12,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.65,
  },
  notice: {
    color: theme.colors.muted,
    fontSize: 10,
    lineHeight: 14,
  },
}));
