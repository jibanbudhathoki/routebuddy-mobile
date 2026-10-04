import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Share, Text, View, Pressable } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type { HomeTrip } from "../types/home";

interface HomeTripCardProps {
  trip: HomeTrip;
  onViewDetails: (trip: HomeTrip) => void;
}

export function HomeTripCard({ trip, onViewDetails }: HomeTripCardProps) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.card}>
      <View style={styles.driverRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarInitials}>{trip.driverInitials}</Text>
          <View style={styles.verified}>
            <MaterialCommunityIcons
              name="check"
              size={9}
              color={theme.colors.onPrimary}
            />
          </View>
        </View>
        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>{trip.driverName}</Text>
          <View style={styles.ratingRow}>
            <MaterialCommunityIcons
              name="star"
              size={13}
              color={theme.colors.secondary}
            />
            <Text style={styles.rating}>{trip.rating}</Text>
            <Text style={styles.tripCount}>({trip.tripCount} trips)</Text>
          </View>
        </View>
        <View style={styles.spotsBadge}>
          <MaterialCommunityIcons
            name="account-multiple"
            size={12}
            color={theme.colors.primary}
          />
          <Text style={styles.spotsText}>
            {trip.remainingSpots} of 3 spots remaining
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
          <Text style={styles.scheduleText}>{trip.departureLabel}</Text>
        </View>
        <View style={styles.scheduleItem}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={12}
            color={theme.colors.muted}
          />
          <Text style={styles.scheduleText}>{trip.deliveryLabel}</Text>
        </View>
      </View>

      <View style={styles.storeRow}>
        {trip.stores.map((store, index) => (
          <StoreBadge key={`${store}-${index}`} name={store} index={index} />
        ))}
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.feeRow}>
          <Text style={styles.feeAmount}>15%</Text>
          <Text style={styles.feeLabel}>Service Fee</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => onViewDetails(trip)}
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
          accessibilityLabel={`Share ${trip.driverName}'s trip`}
          onPress={() =>
            Share.share({
              message: `${trip.origin} to ${trip.destination} with ${trip.driverName}`,
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

function StoreBadge({ name, index }: { name: string; index: number }) {
  const { theme } = useUnistyles();
  const badgeColors = [
    theme.colors.primarySoft,
    theme.colors.primary,
    theme.colors.surface,
    theme.colors.error,
    theme.colors.secondary,
  ];
  const foreground =
    index === 1 || index === 3
      ? theme.colors.onPrimary
      : theme.colors.primary;
  const shortName =
    name === "Home Depot"
      ? "HOME\nDEPOT"
      : name === "No Frills"
        ? "NO\nFRILLS"
        : name;

  return (
    <View
      style={[
        styles.storeBadge,
        { backgroundColor: badgeColors[index % badgeColors.length] },
      ]}
    >
      <Text
        numberOfLines={2}
        style={[styles.storeBadgeText, { color: foreground }]}
      >
        {shortName}
      </Text>
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
    width: 38,
  },
  avatarInitials: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  verified: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    bottom: -1,
    height: 15,
    justifyContent: "center",
    position: "absolute",
    right: -1,
    width: 15,
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
  ratingRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 3,
    marginTop: 2,
  },
  rating: {
    color: theme.colors.text,
    fontSize: 10,
    fontWeight: "600",
  },
  tripCount: {
    color: theme.colors.muted,
    fontSize: 9,
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
  storeRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  storeBadge: {
    alignItems: "center",
    borderColor: theme.colors.border,
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    height: 38,
    justifyContent: "center",
    padding: 2,
  },
  storeBadgeText: {
    fontSize: 7,
    fontWeight: "800",
    textAlign: "center",
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
