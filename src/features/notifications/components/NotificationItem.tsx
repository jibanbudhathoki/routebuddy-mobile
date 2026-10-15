import { Pressable, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

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
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${notification.title}. ${notification.message}`}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.item,
        !notification.isRead && styles.unreadItem,
        disabled && styles.disabledItem,
      ]}
    >
      <View style={styles.copy}>
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.message}>{notification.message}</Text>
      </View>
      {!notification.isRead ? <View style={styles.unreadDot} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  item: {
    alignItems: "flex-start",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
  },
  unreadItem: {
    borderColor: theme.colors.primary,
  },
  disabledItem: {
    opacity: 0.65,
  },
  copy: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  title: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  message: {
    color: theme.colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  unreadDot: {
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
    height: 8,
    marginTop: theme.spacing.xs,
    width: 8,
  },
}));
