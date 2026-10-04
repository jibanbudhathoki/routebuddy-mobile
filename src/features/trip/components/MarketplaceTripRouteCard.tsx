import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { formatLocation } from "./MarketplaceTripOverview";
import type { TripDetailsResponse } from "../types/trip";

export function MarketplaceTripRouteCard({
  trip,
}: {
  trip: TripDetailsResponse;
}) {
  const { theme } = useUnistyles();
  const store = trip.stores?.[0];
  const origin = formatLocation(trip.originAddress) || trip.origin;
  const destination =
    formatLocation(trip.destinationAddress) || trip.destination;

  return (
    <View style={styles.routeCard}>
      <View style={styles.routeTimeline}>
        <RoutePoint
          label="From"
          location={origin}
          store={store?.name}
          address={store ? formatLocation(store.location) : ""}
          first
        />
        <RoutePoint
          label="To"
          location={destination}
          address={formatLocation(trip.destinationAddress)}
          last
        />
      </View>
      {store ? (
        <View style={styles.sideStoreCard}>
          <MaterialCommunityIcons
            name="store-outline"
            size={16}
            color={theme.colors.primary}
          />
          <Text style={styles.sideStoreLabel}>Store</Text>
          <Text style={styles.sideStoreName} numberOfLines={2}>
            {store.name}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function RoutePoint({
  label,
  location,
  store,
  address,
  first = false,
  last = false,
}: {
  label: string;
  location: string;
  store?: string;
  address: string;
  first?: boolean;
  last?: boolean;
}) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.routePoint}>
      <View style={styles.timelineTrack}>
        <View
          style={[
            styles.routeMarker,
            first && styles.routeMarkerFilled,
            last && styles.routeMarkerHollow,
          ]}
        />
        {!last ? <View style={styles.routeLine} /> : null}
      </View>
      <View style={styles.routePointInfo}>
        <Text style={styles.routePointLabel}>{label}</Text>
        <Text style={styles.routePointLocation}>{location}</Text>
        {store ? (
          <View style={styles.routeStoreInfo}>
            <MaterialCommunityIcons
              name="store-outline"
              size={13}
              color={theme.colors.text}
            />
            <View>
              <Text style={styles.routeStoreName}>{store}</Text>
              {address ? (
                <Text style={styles.routeStoreAddress}>{address}</Text>
              ) : null}
            </View>
          </View>
        ) : address ? (
          <Text style={styles.routePointAddress}>{address}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  routeCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 148,
    padding: theme.spacing.sm,
  },
  routeTimeline: {
    flex: 1,
    gap: theme.spacing.sm,
    minWidth: 0,
  },
  routePoint: {
    flexDirection: "row",
    minHeight: 54,
  },
  timelineTrack: {
    alignItems: "center",
    marginRight: theme.spacing.sm,
    width: 14,
  },
  routeMarker: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.primary,
    borderRadius: 5,
    borderWidth: 1.5,
    height: 10,
    marginTop: 2,
    width: 10,
    zIndex: 1,
  },
  routeMarkerFilled: {
    backgroundColor: theme.colors.primary,
  },
  routeMarkerHollow: {
    borderWidth: 2,
  },
  routeLine: {
    borderColor: theme.colors.muted,
    borderStyle: "dashed",
    borderLeftWidth: 1,
    bottom: -theme.spacing.sm,
    position: "absolute",
    top: 10,
  },
  routePointInfo: {
    flex: 1,
    gap: 2,
  },
  routePointLabel: {
    color: theme.colors.text,
    fontSize: 9,
  },
  routePointLocation: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  routeStoreInfo: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: theme.spacing.xs,
    marginTop: 2,
  },
  routeStoreName: {
    color: theme.colors.text,
    fontSize: 9,
  },
  routeStoreAddress: {
    color: theme.colors.muted,
    fontSize: 8,
  },
  routePointAddress: {
    color: theme.colors.muted,
    fontSize: 9,
  },
  sideStoreCard: {
    alignItems: "flex-start",
    alignSelf: "center",
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.sm,
    gap: 3,
    marginLeft: theme.spacing.xs,
    padding: theme.spacing.sm,
    width: 90,
  },
  sideStoreLabel: {
    color: theme.colors.muted,
    fontSize: 8,
  },
  sideStoreName: {
    color: theme.colors.text,
    fontSize: 9,
    fontWeight: "600",
  },
}));
