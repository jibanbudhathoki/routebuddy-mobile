import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface NotificationBellButtonProps {
  unreadCount: number;
  onPress: () => void;
}

export function NotificationBellButton({
  unreadCount,
  onPress,
}: NotificationBellButtonProps) {
  const { theme } = useUnistyles();
  const badgeLabel = unreadCount > 99 ? "99+" : String(unreadCount);
  const accessibilityLabel =
    unreadCount > 0
      ? `Notifications, ${unreadCount} unread`
      : "Notifications";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={styles.button}
    >
      <MaterialCommunityIcons
        name="bell-outline"
        size={22}
        color={theme.colors.primary}
      />
      {unreadCount > 0 ? (
        <View accessible={false} style={styles.badge}>
          <Text style={styles.badgeText}>{badgeLabel}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  button: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    position: "relative",
    width: 40,
  },
  badge: {
    alignItems: "center",
    backgroundColor: theme.colors.error,
    borderColor: theme.colors.surface,
    borderRadius: 9,
    borderWidth: 1,
    height: 18,
    justifyContent: "center",
    minWidth: 18,
    paddingHorizontal: 3,
    position: "absolute",
    right: 0,
    top: 0,
  },
  badgeText: {
    color: theme.colors.onPrimary,
    fontSize: 9,
    fontWeight: "700",
    textAlign: "center",
  },
}));
