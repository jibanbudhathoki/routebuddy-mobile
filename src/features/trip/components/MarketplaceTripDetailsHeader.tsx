import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { NotificationBellButton } from "../../../shared/components/NotificationBellButton";

interface MarketplaceTripDetailsHeaderProps {
  onBack: () => void;
  unreadCount: number;
  onNotificationsPress: () => void;
  onSharePress: () => void;
}

export function MarketplaceTripDetailsHeader({
  onBack,
  unreadCount,
  onNotificationsPress,
  onSharePress,
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
      <View style={styles.headerActions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Share trip"
          onPress={onSharePress}
          style={styles.headerAction}
        >
          <MaterialCommunityIcons
            name="share-variant-outline"
            size={20}
            color={theme.colors.text}
          />
        </Pressable>
        <NotificationBellButton
          unreadCount={unreadCount}
          onPress={onNotificationsPress}
        />
      </View>
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
  headerActions: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    width: 76,
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
}));
