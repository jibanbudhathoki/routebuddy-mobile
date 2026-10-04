import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface MarketplaceTripDetailsHeaderProps {
  onBack: () => void;
  onNotificationsPress: () => void;
}

export function MarketplaceTripDetailsHeader({
  onBack,
  onNotificationsPress,
}: MarketplaceTripDetailsHeaderProps) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={onBack}
        style={styles.headerAction}
      >
        <MaterialCommunityIcons
          name="arrow-left"
          size={23}
          color={theme.colors.text}
        />
      </Pressable>
      <Text style={styles.headerTitle}>Trip Details</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Notifications"
        onPress={onNotificationsPress}
        style={styles.headerAction}
      >
        <MaterialCommunityIcons
          name="bell-outline"
          size={21}
          color={theme.colors.text}
        />
        <View style={styles.notificationBadge}>
          <Text style={styles.notificationBadgeText}>3</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  header: {
    alignItems: "center",
    flexDirection: "row",
    height: 42,
    justifyContent: "space-between",
  },
  headerAction: {
    alignItems: "center",
    height: 36,
    justifyContent: "center",
    position: "relative",
    width: 36,
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  notificationBadge: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    height: 16,
    justifyContent: "center",
    position: "absolute",
    right: 0,
    top: 0,
    width: 16,
  },
  notificationBadgeText: {
    color: theme.colors.onPrimary,
    fontSize: 8,
    fontWeight: "700",
  },
}));
