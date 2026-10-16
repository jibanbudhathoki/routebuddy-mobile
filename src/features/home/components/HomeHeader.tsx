import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { NotificationBellButton } from "../../../shared/components/NotificationBellButton";

interface HomeHeaderProps {
  location: string;
  unreadCount: number;
  onLocationPress: () => void;
  onNotificationsPress: () => void;
}

export function HomeHeader({
  location,
  unreadCount,
  onLocationPress,
  onNotificationsPress,
}: HomeHeaderProps) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.container}>
      <View style={styles.brandRow}>
        <View>
          <Text style={styles.brand}>Route Buddy</Text>
          <Text style={styles.community}>Community</Text>
        </View>
        <NotificationBellButton
          unreadCount={unreadCount}
          onPress={onNotificationsPress}
        />
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Choose location, current location ${location}`}
        onPress={onLocationPress}
        style={styles.locationButton}
      >
        <MaterialCommunityIcons
          name="map-marker"
          size={17}
          color={theme.colors.text}
        />
        <Text style={styles.locationText}>{location}</Text>
        <MaterialCommunityIcons
          name="chevron-down"
          size={20}
          color={theme.colors.text}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    paddingBottom: theme.spacing.sm,
  },
  brandRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  brand: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "800",
  },
  community: {
    color: theme.colors.muted,
    fontSize: 10,
    marginTop: 2,
  },
  locationButton: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    minHeight: 36,
    paddingHorizontal: theme.spacing.sm,
  },
  locationText: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 12,
    fontWeight: "500",
  },
}));
