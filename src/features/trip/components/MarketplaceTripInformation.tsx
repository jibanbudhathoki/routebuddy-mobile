import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type { TripDetailsResponse } from "../types/trip";
import {
  formatApiTime,
  formatDate,
  formatTime,
} from "./MarketplaceTripOverview";

export function MarketplaceTripInformation({
  trip,
}: {
  trip: TripDetailsResponse;
}) {
  const { theme } = useUnistyles();
  const storeCount = trip.stores?.length ?? 0;
  const storeName = trip.stores?.[0]?.name || "Store";

  return (
    <>
      <View style={styles.driverCard}>
        {trip.driver.photoUrl ? (
          <Image
            source={{ uri: trip.driver.photoUrl }}
            style={styles.driverAvatar}
            accessibilityLabel={`${trip.driver.name}'s profile photo`}
          />
        ) : (
          <View style={styles.driverAvatarFallback}>
            <Text style={styles.driverInitials}>
              {getInitials(trip.driver.name)}
            </Text>
          </View>
        )}
        <View style={styles.driverInfo}>
          <Text style={styles.cardEyebrow}>Driver</Text>
          <Text style={styles.driverName}>{trip.driver.name}</Text>
          <Text style={styles.driverAvailability}>
            {trip.availableSeats} of {trip.capacity} spots available
          </Text>
        </View>
        <MaterialCommunityIcons
          name="shield-check"
          size={19}
          color={theme.colors.primary}
        />
      </View>

      <View style={styles.summaryCard}>
        <SummaryColumn
          icon="calendar-blank-outline"
          title="Departing"
          value={formatDate(trip.departureAt)}
          detail={formatApiTime(trip.departureAt)}
        />
        <View style={styles.summaryDivider} />
        <SummaryColumn
          icon="clock-outline"
          title="Will be delivered by (latest)"
          value={formatDate(trip.deliveryLatestBy)}
          detail={formatTime(trip.deliveryLatestBy)}
        />
        <View style={styles.summaryDivider} />
        <SummaryColumn
          icon="store-outline"
          title="Store"
          value={storeName}
          detail={storeCount > 1 ? `+${storeCount - 1} more` : undefined}
        />
      </View>

      <InfoCard
        icon="information-outline"
        title="About This Trip"
        description={
          trip.notes?.trim() || "No additional trip information was provided."
        }
      />
      <InfoCard
        icon="tag-outline"
        title="Service Fee"
        description="This helps keep the service running and supports our community."
        value="15% of order total"
        showInfo
      />
    </>
  );
}

function SummaryColumn({
  icon,
  title,
  value,
  detail,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  value: string;
  detail?: string;
}) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.summaryColumn}>
      <MaterialCommunityIcons
        name={icon}
        size={16}
        color={theme.colors.primary}
      />
      <Text style={styles.summaryTitle} numberOfLines={2}>
        {title}
      </Text>
      <Text style={styles.summaryValue} numberOfLines={2}>
        {value}
      </Text>
      {detail ? (
        <Text style={styles.summaryDetail} numberOfLines={1}>
          {detail}
        </Text>
      ) : null}
    </View>
  );
}

function InfoCard({
  icon,
  title,
  description,
  value,
  showInfo = false,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  description: string;
  value?: string;
  showInfo?: boolean;
}) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.infoCard}>
      <View style={styles.sectionHeading}>
        <MaterialCommunityIcons
          name={icon}
          size={16}
          color={theme.colors.primary}
        />
        <Text style={styles.sectionTitle}>{title}</Text>
        {showInfo ? (
          <MaterialCommunityIcons
            name="information-outline"
            size={14}
            color={theme.colors.muted}
          />
        ) : null}
      </View>
      {value ? <Text style={styles.infoValue}>{value}</Text> : null}
      <Text style={styles.infoText}>{description}</Text>
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
  driverCard: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.sm,
    minHeight: 64,
    padding: theme.spacing.sm,
  },
  driverAvatar: {
    borderRadius: 22,
    height: 44,
    width: 44,
  },
  driverAvatarFallback: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  driverInitials: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  driverInfo: {
    flex: 1,
    gap: 2,
  },
  cardEyebrow: {
    color: theme.colors.muted,
    fontSize: 8,
  },
  driverName: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  driverAvailability: {
    color: theme.colors.muted,
    fontSize: 8,
  },
  summaryCard: {
    alignItems: "stretch",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 85,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
  },
  summaryColumn: {
    alignItems: "center",
    flex: 1,
    gap: 3,
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  summaryDivider: {
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.xs,
    width: 1,
  },
  summaryTitle: {
    color: theme.colors.muted,
    fontSize: 7,
    textAlign: "center",
  },
  summaryValue: {
    color: theme.colors.text,
    fontSize: 9,
    fontWeight: "700",
    textAlign: "center",
  },
  summaryDetail: {
    color: theme.colors.text,
    fontSize: 8,
    textAlign: "center",
  },
  infoCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: 4,
    padding: theme.spacing.sm,
  },
  sectionHeading: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  sectionTitle: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 10,
    fontWeight: "700",
  },
  infoValue: {
    color: theme.colors.text,
    fontSize: 9,
    fontWeight: "600",
  },
  infoText: {
    color: theme.colors.muted,
    fontSize: 8,
    lineHeight: 12,
  },
}));
