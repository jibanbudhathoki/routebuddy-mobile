import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface HomeHeaderProps {
  location: string;
  onLocationPress: () => void;
  onNotificationsPress: () => void;
}

export function HomeHeader({
  location,
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
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          onPress={onNotificationsPress}
          style={styles.notificationButton}
        >
          <MaterialCommunityIcons
            name="bell-outline"
            size={22}
            color={theme.colors.primary}
          />
          <View style={styles.notificationDot} />
        </Pressable>
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
          color={theme.colors.primary}
        />
        <Text style={styles.locationText}>{location}</Text>
        <MaterialCommunityIcons
          name="chevron-down"
          size={20}
          color={theme.colors.primary}
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
    color: theme.colors.primary,
    fontSize: 20,
    fontWeight: "800",
  },
  community: {
    color: theme.colors.muted,
    fontSize: 10,
    marginTop: 2,
  },
  notificationButton: {
    alignItems: "center",
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  notificationDot: {
    backgroundColor: theme.colors.secondary,
    borderColor: theme.colors.surface,
    borderRadius: 4,
    borderWidth: 1,
    height: 8,
    position: "absolute",
    right: 4,
    top: 4,
    width: 8,
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
