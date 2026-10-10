import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type { TripDetailsResponse } from "../types/trip";

export function TripDetailsDriverSections({
  trip,
}: {
  trip: TripDetailsResponse;
}) {
  const { theme } = useUnistyles();

  return (
    <>
      <View style={styles.section}>
        <SectionTitle title="Driver" />
        <View style={styles.customerRow}>
          {trip.driver.photoUrl ? (
            <Image
              source={{ uri: trip.driver.photoUrl }}
              style={styles.avatarImage}
              accessibilityLabel={`${trip.driver.name}'s profile photo`}
            />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {getInitials(trip.driver.name)}
              </Text>
            </View>
          )}
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{trip.driver.name}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle title="Delivery Instructions" />
        <View style={[styles.card, styles.instructions]}>
          <MaterialCommunityIcons
            name="message-outline"
            size={15}
            color={theme.colors.muted}
          />
          <Text style={styles.instructionsText}>
            {trip.notes || "No delivery instructions were provided."}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle title="Trip Details" />
        <View style={[styles.card, styles.tripMetrics]}>
          <DetailMetric
            icon="store-outline"
            label="Stores"
            value={String(trip.stores.length)}
          />
          <DetailMetric
            icon="seat-outline"
            label="Available"
            value={String(trip.availableSeats)}
          />
          <DetailMetric
            icon="seatbelt"
            label="Capacity"
            value={String(trip.capacity)}
          />
          <MaterialCommunityIcons
            name="chevron-right"
            size={17}
            color={theme.colors.text}
          />
        </View>
      </View>
    </>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

function DetailMetric({
  icon,
  label,
  value,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
}) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.detailMetric}>
      <View style={styles.metricLabel}>
        <MaterialCommunityIcons
          name={icon}
          size={14}
          color={theme.colors.text}
        />
        <Text style={styles.metricTitle}>{label}</Text>
      </View>
      <Text style={styles.metricValue}>{value}</Text>
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
  customerRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  avatar: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 21,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  avatarImage: {
    borderRadius: 21,
    height: 42,
    width: 42,
  },
  avatarText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  customerInfo: {
    flex: 1,
    gap: 3,
  },
  customerName: {
    color: theme.colors.text,
    fontSize: 11,
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
  instructions: {
    alignItems: "flex-start",
    backgroundColor: theme.colors.background,
    borderWidth: 0,
    flexDirection: "row",
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
  },
  instructionsText: {
    color: theme.colors.muted,
    flex: 1,
    fontSize: 9,
    lineHeight: 14,
  },
  tripMetrics: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 48,
    paddingVertical: theme.spacing.xs,
  },
  detailMetric: {
    gap: 3,
  },
  metricLabel: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  metricTitle: {
    color: theme.colors.muted,
    fontSize: 8,
  },
  metricValue: {
    color: theme.colors.text,
    fontSize: 9,
    fontWeight: "600",
    paddingLeft: 18,
  },
}));
