import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type { TripDetailsResponse } from "../types/trip";

export function MarketplaceTripOverview({
  trip,
}: {
  trip: TripDetailsResponse;
}) {
  const { theme } = useUnistyles();
  const storeName = trip.stores?.[0]?.name || "Store";
  const origin = formatLocation(trip.originAddress) || trip.origin;
  const destination =
    formatLocation(trip.destinationAddress) || trip.destination;
  const status =
    trip.status.toLowerCase() === "open" ? "Upcoming Trip" : trip.status;
  const tripCode = trip.uid.replace(/^trip_/, "").slice(0, 8).toUpperCase();

  return (
    <>
      <View style={styles.metadataRow}>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{status}</Text>
        </View>
        <Text style={styles.tripCode}>Trip ID: #{tripCode}</Text>
      </View>
      <View style={styles.storeHeader}>
        <View style={styles.storeLogo}>
          <MaterialCommunityIcons
            name="storefront-outline"
            size={30}
            color={theme.colors.onPrimary}
          />
        </View>
        <View style={styles.storeHeaderInfo}>
          <Text style={styles.storeHeaderTitle}>{storeName} Run</Text>
          <Text style={styles.routeSubtitle}>
            {origin} to {destination}
          </Text>
          <View style={styles.inlineMetadata}>
            <MaterialCommunityIcons
              name="calendar-blank-outline"
              size={12}
              color={theme.colors.muted}
            />
            <Text style={styles.inlineMetadataText}>
              {formatDate(trip.departureAt)}
            </Text>
            <MaterialCommunityIcons
              name="clock-outline"
              size={12}
              color={theme.colors.muted}
            />
            <Text style={styles.inlineMetadataText}>
              Departs at {formatApiTime(trip.departureAt)}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
}

export function formatLocation(
  location:
    | TripDetailsResponse["originAddress"]
    | TripDetailsResponse["destinationAddress"]
    | TripDetailsResponse["stores"][number]["location"]
    | undefined,
) {
  if (!location) return "";
  return [location.city?.name, location.province?.name]
    .filter(Boolean)
    .join(", ");
}

export function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatApiTime(value: string) {
  const timeMatch = value.match(/T(\d{2}):(\d{2})/);
  if (!timeMatch) return formatTime(value);

  const hours = Number(timeMatch[1]);
  const minutes = Number(timeMatch[2]);
  if (hours > 23 || minutes > 59) return "-";

  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${timeMatch[2]} ${period}`;
}

const styles = StyleSheet.create((theme) => ({
  metadataRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusBadge: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.lg,
    flexDirection: "row",
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  statusDot: {
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
    height: 6,
    width: 6,
  },
  statusText: {
    color: theme.colors.primary,
    fontSize: 9,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  tripCode: {
    color: theme.colors.muted,
    fontSize: 9,
  },
  storeHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  storeLogo: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: 7,
    height: 52,
    justifyContent: "center",
    width: 52,
  },
  storeHeaderInfo: {
    flex: 1,
    gap: 2,
  },
  storeHeaderTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  routeSubtitle: {
    color: theme.colors.text,
    fontSize: 11,
    fontWeight: "500",
  },
  inlineMetadata: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 2,
  },
  inlineMetadataText: {
    color: theme.colors.muted,
    fontSize: 8,
    marginRight: theme.spacing.xs,
  },
}));
