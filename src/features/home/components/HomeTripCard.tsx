import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Share, Text, View, Pressable } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type { ListAllTripsItem } from "../../trip/types/trip";

interface HomeTripCardProps {
  trip: ListAllTripsItem;
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
  const delivery = new Date(trip.deliveryLatestBy);
  const deliveryLabel = Number.isNaN(delivery.getTime())
    ? "Delivery time unavailable"
    : `Deliver by ${delivery.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
      })} latest`;
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
        <View style={styles.scheduleItem}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={12}
            color={theme.colors.muted}
          />
          <Text style={styles.scheduleText}>{deliveryLabel}</Text>
        </View>
      </View>

      {trip.stores.length > 0 ? (
        <View style={styles.storeRow}>
          {trip.stores.slice(0, 5).map((store, index) => (
            <View key={`${store}-${index}`} style={styles.storeTile}>
              <MaterialCommunityIcons
                name="storefront-outline"
                size={14}
                color={theme.colors.primary}
              />
              <Text style={styles.storeName} numberOfLines={2}>
                {store}
              </Text>
            </View>
          ))}
          {trip.stores.length > 5 ? (
            <View style={[styles.storeTile, styles.moreStoresTile]}>
              <Text style={styles.moreStoresText}>
                +{trip.stores.length - 5}
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}

      <View style={styles.cardFooter}>
        <View style={styles.feeRow}>
          <Text style={styles.feeAmount}>15%</Text>
          <Text style={styles.feeLabel}>Service Fee</Text>
          <Text style={styles.price}>{trip.price ?? "-"}</Text>
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
  storeRow: {
    flexDirection: "row",
    gap: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  storeTile: {
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    gap: 2,
    height: 38,
    justifyContent: "center",
    minWidth: 0,
    paddingHorizontal: 2,
  },
  storeName: {
    color: theme.colors.text,
    fontSize: 7,
    fontWeight: "600",
    textAlign: "center",
  },
  moreStoresTile: {
    flex: 0,
    width: 34,
  },
  moreStoresText: {
    color: theme.colors.primary,
    fontSize: 9,
    fontWeight: "700",
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
  price: {
    color: theme.colors.text,
    fontSize: 8,
    fontWeight: "600",
    marginLeft: theme.spacing.xs,
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
