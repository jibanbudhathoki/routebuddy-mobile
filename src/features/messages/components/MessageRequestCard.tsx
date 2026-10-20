import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { MessageGesturePressable } from "./MessageGesturePressable";
import { MessageResponseActions } from "./MessageResponseActions";
import type { RequestAction } from "../../request/types/request";

interface MessageRequestCardProps {
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  status: string;
  statusMessage: string;
  createdAt: string;
  isMine: boolean;
  isRead?: boolean;
  canRespond: boolean;
  showActions: boolean;
  isResponding: boolean;
  respondingAction?: RequestAction;
  selected: boolean;
  selectionMode: boolean;
  children: ReactNode;
  onPress: () => void;
  onLongPress: () => void;
  onDoubleTap: () => void;
  onAction: (action: RequestAction) => void;
}

export function MessageRequestCard({
  title,
  icon,
  status,
  statusMessage,
  createdAt,
  isMine,
  isRead,
  canRespond,
  showActions,
  isResponding,
  respondingAction,
  selected,
  selectionMode,
  children,
  onPress,
  onLongPress,
  onDoubleTap,
  onAction,
}: MessageRequestCardProps) {
  const { theme } = useUnistyles();
  const normalizedStatus = status.trim().toLowerCase();
  const isSuccess = ["accepted", "completed", "delivered", "confirmed"].includes(
    normalizedStatus,
  );
  const isError = ["rejected", "cancelled", "canceled", "failed"].includes(
    normalizedStatus,
  );
  const statusColor = isSuccess
    ? theme.colors.success
    : isError
      ? theme.colors.error
      : theme.colors.text;
  const statusBackground = isSuccess
    ? theme.colors.successSoft
    : theme.colors.primarySoft;

  return (
    <View style={[styles.card, selected && styles.selectedCard]}>
      <MessageGesturePressable
        selectionMode={selectionMode}
        accessibilityLabel={selected ? `Deselect ${title.toLowerCase()}` : title}
        onPress={onPress}
        onLongPress={onLongPress}
        onDoubleTap={onDoubleTap}
        style={styles.content}
      >
        <View style={styles.heading}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={icon}
              size={18}
              color={theme.colors.text}
            />
          </View>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <View
            accessibilityLabel={`Status: ${formatStatus(status)}`}
            style={[styles.statusBadge, { backgroundColor: statusBackground }]}
          >
            <MaterialCommunityIcons
              name={
                isSuccess
                  ? "check-circle"
                  : isError
                    ? "close-circle"
                    : "clock-outline"
              }
              size={13}
              color={statusColor}
            />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {formatStatus(status)}
            </Text>
          </View>
        </View>

        <View style={styles.statusSummary}>
          <MaterialCommunityIcons
            name={
              isSuccess
                ? "check-decagram-outline"
                : isError
                  ? "alert-circle-outline"
                  : "information-outline"
            }
            size={15}
            color={statusColor}
          />
          <Text style={styles.statusMessage}>{statusMessage}</Text>
        </View>

        <View style={styles.details}>{children}</View>
        <View style={styles.footer}>
          <Text style={styles.time}>{formatTime(createdAt)}</Text>
          {isMine ? (
            <MaterialCommunityIcons
              name={isRead ? "check-all" : "check"}
              size={13}
              color={isRead ? theme.colors.primary : theme.colors.muted}
              accessibilityLabel={isRead ? "Read" : "Sent"}
            />
          ) : null}
        </View>
      </MessageGesturePressable>

      {showActions && canRespond ? (
        <MessageResponseActions
          isResponding={isResponding}
          respondingAction={respondingAction}
          onAction={onAction}
        />
      ) : null}
    </View>
  );
}

function formatStatus(status: string) {
  const normalized = status.trim().toLowerCase();
  if (normalized === "pending" || normalized === "open") return "Pending";
  if (normalized === "sent") return "Sent";
  if (normalized === "rejected") return "Declined";
  if (normalized === "cancelled" || normalized === "canceled") {
    return "Cancelled";
  }
  return status.replace(/[_-]/g, " ").replace(/\b\w/g, (letter) =>
    letter.toUpperCase(),
  );
}

function formatTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const styles = StyleSheet.create((theme) => ({
  card: {
    alignSelf: "stretch",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.sm,
  },
  selectedCard: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  content: {
    gap: theme.spacing.sm,
  },
  heading: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  iconContainer: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.sm,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  title: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
  },
  statusBadge: {
    alignItems: "center",
    borderRadius: theme.radius.sm,
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 5,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
  },
  statusSummary: {
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.sm,
    flexDirection: "row",
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  statusMessage: {
    color: theme.colors.muted,
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
  },
  details: {
    gap: theme.spacing.sm,
  },
  footer: {
    alignItems: "center",
    alignSelf: "flex-end",
    flexDirection: "row",
    gap: 4,
    minHeight: 14,
  },
  time: {
    color: theme.colors.muted,
    fontSize: 10,
  },
}));
