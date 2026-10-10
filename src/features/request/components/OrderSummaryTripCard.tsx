import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface OrderSummaryTripCardProps {
  storeName: string;
  storeLogoText: string;
  storeLogoSubText: string;
  routeText: string;
  neededBy?: string;
  latestDeliveryTime?: string;
}

export function OrderSummaryTripCard({
  storeName,
  storeLogoText,
  storeLogoSubText,
  routeText,
  neededBy,
  latestDeliveryTime,
}: OrderSummaryTripCardProps) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.tripCard}>
      <View style={styles.storeLogoContainer}>
        <Text style={styles.storeLogoText} numberOfLines={1}>
          {storeLogoText}
        </Text>
        {!!storeLogoSubText && (
          <Text style={styles.storeLogoSubText} numberOfLines={1}>
            {storeLogoSubText}
          </Text>
        )}
      </View>
      <View style={styles.tripCardInfo}>
        <Text style={styles.tripCardTitle}>{storeName} Run</Text>
        <Text style={styles.tripCardRoute}>{routeText}</Text>
        <View style={styles.tripCardDetails}>
          <View style={styles.tripCardDetailItem}>
            <MaterialCommunityIcons
              name="calendar-outline"
              size={14}
              color={theme.colors.text}
              style={styles.detailIcon}
            />
            <Text style={styles.tripCardDetailText}>
              {formatDate(neededBy)}
            </Text>
          </View>
          <Text style={styles.tripCardDetailDivider}>|</Text>
          <View style={styles.tripCardDetailItem}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={14}
              color={theme.colors.text}
              style={styles.detailIcon}
            />
            <Text style={styles.tripCardDetailText}>
              Delivery by {formatTime(latestDeliveryTime)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function formatDate(isoString?: string) {
  if (!isoString) return "";
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(isoString?: string) {
  if (!isoString) return "";
  return new Date(isoString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

const styles = StyleSheet.create((theme) => ({
  tripCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.md,
  },
  storeLogoContainer: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    height: 70,
    justifyContent: "center",
    marginRight: theme.spacing.md,
    width: 70,
  },
  storeLogoText: {
    color: theme.colors.surface,
    fontSize: 14,
    fontStyle: "italic",
    fontWeight: "900",
  },
  storeLogoSubText: {
    color: theme.colors.surface,
    fontSize: 8,
    fontWeight: "bold",
    marginTop: 2,
  },
  tripCardInfo: {
    flex: 1,
    justifyContent: "center",
  },
  tripCardTitle: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  tripCardRoute: {
    color: theme.colors.text,
    fontSize: 13,
    marginBottom: 8,
  },
  tripCardDetails: {
    alignItems: "center",
    flexDirection: "row",
  },
  tripCardDetailItem: {
    alignItems: "center",
    flexDirection: "row",
  },
  detailIcon: {
    opacity: 0.6,
  },
  tripCardDetailText: {
    color: theme.colors.text,
    fontSize: 12,
    marginLeft: 4,
    opacity: 0.6,
  },
  tripCardDetailDivider: {
    color: theme.colors.border,
    fontSize: 12,
    marginHorizontal: 8,
  },
}));
