import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type { TripDetailsResponse } from "../types/trip";

export function TripDetailsRouteSections({
  trip,
}: {
  trip: TripDetailsResponse;
}) {
  const { theme } = useUnistyles();

  return (
    <>
      <View style={styles.section}>
        <SectionTitle title={`Stores (${trip.stores.length})`} />
        <View style={styles.card}>
          {trip.stores.map((store, index) => (
            <StoreRow
              key={store.uid}
              name={store.name}
              location={`${store.location.city.name}, ${store.location.province.name}`}
              showDivider={index < trip.stores.length - 1}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle title="Route Overview" />
        <View style={[styles.card, styles.routeCard]}>
          <View style={styles.routeStops}>
            <RouteStop label="Pickup" location={trip.origin} />
            <RouteStop label="Delivery" location={trip.destination} />
          </View>
          <View style={styles.mapButton}>
            <MaterialCommunityIcons
              name="navigation-variant"
              size={15}
              color={theme.colors.text}
            />
            <Text style={styles.mapButtonText}>View on Map</Text>
          </View>
        </View>
      </View>
    </>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

function StoreRow({
  name,
  location,
  showDivider,
}: {
  name: string;
  location: string;
  showDivider: boolean;
}) {
  return (
    <View style={[styles.storeRow, showDivider && styles.storeRowDivider]}>
      <View style={styles.storeLogo}>
        <Text style={styles.storeLogoText}>{getInitials(name)}</Text>
      </View>
      <View style={styles.storeInfo}>
        <Text style={styles.storeName} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.storeItems} numberOfLines={1}>
          {location}
        </Text>
      </View>
    </View>
  );
}

function RouteStop({ label, location }: { label: string; location: string }) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.routeStop}>
      <MaterialCommunityIcons
        name="map-marker"
        size={17}
        color={theme.colors.primary}
      />
      <View>
        <Text style={styles.stopLabel}>{label}</Text>
        <Text style={styles.stopLocation}>{location}</Text>
      </View>
    </View>
  );
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const styles = StyleSheet.create((theme) => ({
  section: {
    gap: 5,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    overflow: "hidden",
    paddingHorizontal: theme.spacing.sm,
  },
  storeRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm,
    minHeight: 52,
  },
  storeRowDivider: {
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
  },
  storeLogo: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: 5,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  storeLogoText: {
    color: theme.colors.onPrimary,
    fontSize: 11,
    fontWeight: "800",
  },
  storeInfo: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  storeName: {
    color: theme.colors.text,
    fontSize: 10,
    fontWeight: "600",
  },
  storeItems: {
    color: theme.colors.muted,
    fontSize: 9,
  },
  routeCard: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 78,
    paddingVertical: theme.spacing.sm,
  },
  routeStops: {
    gap: theme.spacing.sm,
  },
  routeStop: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  stopLabel: {
    color: theme.colors.text,
    fontSize: 10,
    fontWeight: "600",
  },
  stopLocation: {
    color: theme.colors.muted,
    fontSize: 9,
    marginTop: 2,
  },
  mapButton: {
    alignItems: "center",
    borderColor: theme.colors.border,
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  mapButtonText: {
    color: theme.colors.text,
    fontSize: 9,
    fontWeight: "500",
  },
}));
