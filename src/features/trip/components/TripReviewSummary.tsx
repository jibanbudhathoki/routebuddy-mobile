import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type { CreateTripRequest } from "../types/trip";

type TripReviewSummaryProps = {
  trip: Partial<CreateTripRequest>;
};

export function TripReviewSummary({ trip }: TripReviewSummaryProps) {
  const { theme } = useUnistyles();

  return (
    <>
      <Text style={styles.sectionTitle}>Trip Summary</Text>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderLocation}>
            {trip.originCityName || "Not set"}
          </Text>
          <MaterialCommunityIcons
            name="arrow-right"
            size={20}
            color={theme.colors.muted}
            style={styles.cardHeaderIcon}
          />
          <Text style={styles.cardHeaderLocation}>
            {trip.destinationCityName || "Not set"}
          </Text>
        </View>

        <SummaryRow
          icon="calendar-blank-outline"
          label="Day of Departure"
          value={formatDate(trip.departureAt)}
        />
        <SummaryRow
          icon="clock-outline"
          label="Ordering Cut-off"
          value={formatDate(trip.orderCutoffAt)}
        />
        <SummaryRow
          icon="calendar-check-outline"
          label="Delivery Latest By"
          value={formatDate(trip.deliveryLatestBy)}
        />

        <View style={styles.divider} />

        <SummaryRow
          icon="shopping-outline"
          label="Store(s)"
          value={
            trip.stores?.length
              ? `${trip.stores.length} store(s) selected`
              : "None"
          }
        />
        <SummaryRow
          icon="map-marker-outline"
          label="From"
          value={trip.originCityName || "Not set"}
        />
        <SummaryRow
          icon="map-marker-outline"
          label="To"
          value={trip.destinationCityName || "Not set"}
        />
        <SummaryRow
          icon="account-group-outline"
          label="Maximum Number of Orders"
          sublabel="Maximum requests you can take"
          value={trip.capacity?.toString() || "Not set"}
        />
        <SummaryRow
          icon="cash"
          label="Trip Price"
          value={trip.price === undefined ? "-" : String(trip.price)}
        />
        <View style={styles.summaryRow}>
          <View style={styles.summaryRowLeft}>
            <MaterialCommunityIcons
              name="file-document-outline"
              size={20}
              color={theme.colors.text}
              style={styles.summaryIcon}
            />
            <Text style={styles.summaryLabel}>
              Notes to Shoppers (Optional)
            </Text>
          </View>
          <Text style={[styles.summaryValue, styles.summaryValueMultiline]}>
            {trip.notes || "None"}
          </Text>
        </View>
      </View>
      <View style={styles.infoBanner}>
        <MaterialCommunityIcons
          name="information-outline"
          size={24}
          color={theme.colors.text}
          style={styles.infoIcon}
        />
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoTitle}>Looks good?</Text>
          <Text style={styles.infoText}>
            Once posted, shoppers in your area will see your trip and can place
            requests.
          </Text>
        </View>
      </View>
    </>
  );
}

function SummaryRow({
  icon,
  label,
  value,
  sublabel,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
  sublabel?: string;
}) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.summaryRow}>
      <View style={styles.summaryRowLeft}>
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={theme.colors.text}
          style={styles.summaryIcon}
        />
        <View>
          <Text style={styles.summaryLabel}>{label}</Text>
          {sublabel ? (
            <Text style={styles.summarySublabel}>{sublabel}</Text>
          ) : null}
        </View>
      </View>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "Not set";
  return new Date(dateStr).toLocaleString();
}

const styles = StyleSheet.create((theme) => ({
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  cardHeaderLocation: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  cardHeaderIcon: {
    marginHorizontal: theme.spacing.sm,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
  },
  summaryRowLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    marginRight: theme.spacing.md,
  },
  summaryIcon: {
    marginTop: 2,
    marginRight: theme.spacing.sm,
  },
  summaryLabel: {
    fontSize: 14,
    color: theme.colors.muted,
    marginTop: 3,
  },
  summarySublabel: {
    fontSize: 12,
    color: theme.colors.muted,
    marginTop: 2,
  },
  summaryValue: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: "500",
    textAlign: "right",
    marginTop: 3,
  },
  summaryValueMultiline: {
    flex: 1,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  infoBanner: {
    flexDirection: "row",
    backgroundColor: theme.colors.primarySoft,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.xl,
  },
  infoIcon: {
    marginRight: theme.spacing.sm,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
}));
