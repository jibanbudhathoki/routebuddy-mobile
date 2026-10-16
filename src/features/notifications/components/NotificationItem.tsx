import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type { AppNotification } from "../types/notification";

interface NotificationItemProps {
  notification: AppNotification;
  disabled: boolean;
  onPress: () => void;
}

export function NotificationItem({
  notification,
  disabled,
  onPress,
}: NotificationItemProps) {
  const { theme } = useUnistyles();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${notification.title}. ${notification.message}${notification.isRead ? "" : ". Unread"}`}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.item,
        !notification.isRead && styles.unreadItem,
        pressed && styles.pressedItem,
        disabled && styles.disabledItem,
      ]}
    >
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons
          name={getNotificationIcon(notification.type)}
          size={20}
          color={theme.colors.primary}
        />
      </View>
      <View style={styles.copy}>
        <View style={styles.titleRow}>
          <Text
            style={[styles.title, !notification.isRead && styles.unreadTitle]}
            numberOfLines={1}
          >
            {notification.title}
          </Text>
          <Text style={styles.timestamp}>
            {formatNotificationTime(notification.createdAt)}
          </Text>
        </View>
        <Text
          style={[
            styles.message,
            !notification.isRead && styles.unreadMessage,
          ]}
          numberOfLines={2}
        >
          {notification.message}
        </Text>
      </View>
      {!notification.isRead ? <View style={styles.unreadDot} /> : null}
    </Pressable>
  );
}

function getNotificationIcon(type: string): keyof typeof MaterialCommunityIcons.glyphMap {
  switch (type.toLowerCase()) {
    case "trip":
      return "car-outline";
    case "request":
      return "package-variant-closed";
    case "message":
      return "message-text-outline";
    default:
      return "bell-outline";
  }
}

function formatNotificationTime(value: string): string {
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return "";

  const elapsedMinutes = Math.max(
    0,
    Math.floor((Date.now() - timestamp) / 60_000),
  );
  if (elapsedMinutes < 1) return "now";
  if (elapsedMinutes < 60) return `${elapsedMinutes}m ago`;

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours}h ago`;

  const elapsedDays = Math.floor(elapsedHours / 24);
  if (elapsedDays < 7) return `${elapsedDays}d ago`;

  return new Date(timestamp).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

const styles = StyleSheet.create((theme) => ({
  item: {
    alignItems: "center",
    backgroundColor: theme.colors.background,
    flexDirection: "row",
    gap: theme.spacing.md,
    minHeight: 76,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  unreadItem: {
    backgroundColor: theme.colors.primarySoft,
  },
  pressedItem: {
    opacity: 0.75,
  },
  disabledItem: {
    opacity: 0.6,
  },
  iconWrap: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  copy: {
    flex: 1,
    gap: theme.spacing.xs,
    minWidth: 0,
  },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  title: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },
  unreadTitle: {
    fontWeight: "800",
  },
  timestamp: {
    color: theme.colors.muted,
    fontSize: 11,
  },
  message: {
    color: theme.colors.muted,
    fontSize: 12,
    lineHeight: 17,
  },
  unreadMessage: {
    color: theme.colors.text,
    fontWeight: "500",
  },
  unreadDot: {
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
    height: 8,
    width: 8,
  },
}));
