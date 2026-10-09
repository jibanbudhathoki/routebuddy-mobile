import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

interface RequestTripPreviewCardProps {
  storeName: string;
  storeLogoText: string;
  storeLogoSubText: string;
  routeText: string;
  neededBy?: string;
  latestDeliveryTime?: string;
}

export function RequestTripPreviewCard({
  storeName,
  storeLogoText,
  storeLogoSubText,
  routeText,
  neededBy,
  latestDeliveryTime,
}: RequestTripPreviewCardProps) {
  return (
    <View style={styles.card}>
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
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {storeName} Run
        </Text>
        <Text style={styles.route} numberOfLines={1}>
          {routeText}
        </Text>
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons
              name="calendar-outline"
              size={14}
              color={styles.detailText.color}
            />
            <Text style={styles.detailText}>{formatDate(neededBy)}</Text>
          </View>
          <Text style={styles.divider}>|</Text>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={14}
              color={styles.detailText.color}
            />
            <Text style={styles.detailText}>
              Delivery by {formatTime(latestDeliveryTime)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function formatDate(dateValue?: string) {
  if (!dateValue) return "Not selected";
  const date = new Date(dateValue);
  return Number.isNaN(date.getTime())
    ? "Not selected"
    : date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}

function formatTime(dateValue?: string) {
  if (!dateValue) return "Not selected";
  const date = new Date(dateValue);
  return Number.isNaN(date.getTime())
    ? "Not selected"
    : date.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
      });
}

const styles = StyleSheet.create((theme) => ({
  card: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.md,
  },
  storeLogoContainer: {
    width: 70,
    height: 70,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  storeLogoText: {
    color: theme.colors.onPrimary,
    fontWeight: "900",
    fontSize: 14,
    fontStyle: "italic",
  },
  storeLogoSubText: {
    color: theme.colors.onPrimary,
    fontWeight: "bold",
    fontSize: 8,
    marginTop: 2,
  },
  info: {
    flex: 1,
    justifyContent: "center",
    minWidth: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 4,
  },
  route: {
    fontSize: 13,
    color: theme.colors.text,
    marginBottom: 8,
  },
  details: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    rowGap: theme.spacing.xs,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: 12,
    color: theme.colors.muted,
    marginLeft: 4,
  },
  divider: {
    fontSize: 12,
    color: theme.colors.border,
    marginHorizontal: theme.spacing.sm,
  },
}));
