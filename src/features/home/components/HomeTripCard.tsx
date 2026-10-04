import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Share, Text, View, Pressable } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type { ListMyTripsResponse } from "../../trip/types/trip";

interface HomeTripCardProps {
  trip: ListMyTripsResponse;
}

export function HomeTripCard({ trip }: HomeTripCardProps) {
  const router = useRouter();
  const { theme } = useUnistyles();
  const departure = new Date(trip.departureAt);
  const departureDate = Number.isNaN(departure.getTime())
    ? trip.departureAt
    : departure.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
  const departureTime = Number.isNaN(departure.getTime())
    ? ""
    : departure.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
      });
  const initials = trip.driver.name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={styles.card}>
      <View style={styles.driverRow}>
        {trip.driver.photoUrl ? (
          <Image
            source={{ uri: trip.driver.photoUrl }}
            style={styles.avatar}
            accessibilityLabel={`${trip.driver.name}'s profile photo`}
          />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>{initials}</Text>
          </View>
        )}
        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>{trip.driver.name}</Text>
          <View style={styles.statusRow}>
            <MaterialCommunityIcons
              name="check-circle"
              size={13}
              color={theme.colors.primary}
            />
            <Text style={styles.statusText}>
              {trip.status.replace(/[_-]+/g, " ")}
            </Text>
          </View>
        </View>
        <View style={styles.spotsBadge}>
          <MaterialCommunityIcons
            name="account-multiple"
            size={12}
            color={theme.colors.primary}
          />
          <Text style={styles.spotsText}>
            {trip.availableSeats} of {trip.capacity} spots remaining
          </Text>
        </View>
      </View>

      <View style={styles.routeRow}>
        <Text style={styles.route}>{trip.origin}</Text>
        <MaterialCommunityIcons
          name="arrow-right"
          size={16}
          color={theme.colors.text}
        />
        <Text style={styles.route}>{trip.destination}</Text>
      </View>

      <View style={styles.scheduleRow}>
        <View style={styles.scheduleItem}>
          <MaterialCommunityIcons
            name="calendar-blank-outline"
            size={12}
            color={theme.colors.muted}
          />
          <Text style={styles.scheduleText}>{departureDate}</Text>
        </View>
        {departureTime ? (
          <View style={styles.scheduleItem}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={12}
              color={theme.colors.muted}
            />
            <Text style={styles.scheduleText}>{departureTime}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Price</Text>
          <Text style={styles.feeAmount}>{trip.price ?? "-"}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            router.push({
              pathname: "/(tabs)/marketplace-trip-details",
              params: { uid: trip.uid },
            })
          }
          style={styles.detailsButton}
        >
          <Text style={styles.detailsText}>View Trip Details</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={16}
            color={theme.colors.onPrimary}
          />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Share ${trip.driver.name}'s trip`}
          onPress={() =>
            Share.share({
              message: `${trip.origin} to ${trip.destination} with ${trip.driver.name}`,
            })
          }
          style={styles.shareButton}
        >
          <MaterialCommunityIcons
            name="share-variant"
            size={17}
            color={theme.colors.primary}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    elevation: 2,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.sm,
    shadowColor: theme.colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  driverRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  avatar: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 19,
    height: 38,
    justifyContent: "center",
    marginRight: theme.spacing.sm,
    resizeMode: "cover",
    width: 38,
  },
  avatarInitials: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  driverInfo: {
    flex: 1,
    minWidth: 0,
  },
  driverName: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  statusRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 3,
    marginTop: 2,
  },
  statusText: {
    color: theme.colors.muted,
    fontSize: 9,
    textTransform: "capitalize",
  },
  spotsBadge: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.lg,
    flexDirection: "row",
    gap: 3,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 5,
  },
  spotsText: {
    color: theme.colors.primary,
    fontSize: 8,
    fontWeight: "600",
  },
  routeRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  route: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "600",
  },
  scheduleRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  scheduleItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  scheduleText: {
    color: theme.colors.muted,
    fontSize: 9,
  },
  cardFooter: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  feeRow: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  feeAmount: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: "800",
  },
  feeLabel: {
    color: theme.colors.muted,
    fontSize: 8,
  },
  detailsButton: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: 6,
    flexDirection: "row",
    gap: 2,
    justifyContent: "center",
    minHeight: 32,
    paddingHorizontal: theme.spacing.sm,
  },
  detailsText: {
    color: theme.colors.onPrimary,
    fontSize: 9,
    fontWeight: "600",
  },
  shareButton: {
    alignItems: "center",
    borderColor: theme.colors.primary,
    borderRadius: 6,
    borderWidth: 1,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
}));
