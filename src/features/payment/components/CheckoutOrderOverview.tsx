import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface CheckoutOrderOverviewProps {
  itemCount: number;
  storeName: string;
  storeLogoText: string;
  storeLogoSubText: string;
  routeText: string;
  neededBy?: string;
  subtotal: number;
  serviceFee: number;
  taxes: number;
  total: number;
}

export function CheckoutOrderOverview({
  itemCount,
  storeName,
  storeLogoText,
  storeLogoSubText,
  routeText,
  neededBy,
  subtotal,
  serviceFee,
  taxes,
  total,
}: CheckoutOrderOverviewProps) {
  const { theme } = useUnistyles();

  return (
    <>
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
              <Text style={styles.tripCardDetailText}>Delivery by 6:00 PM</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        <SummaryRow label={`Items Subtotal (${itemCount} items)`} value={subtotal} />
        <SummaryRow label="Service Fee (15%)" value={serviceFee} showInfo />
        <SummaryRow label="Estimated Taxes (5%)" value={taxes} showInfo />
        <View style={styles.divider} />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total to Pay</Text>
          <View style={styles.totalValueContainer}>
            <Text style={styles.totalSymbol}>$</Text>
            <Text style={styles.totalValue}>{total.toFixed(2)}</Text>
            <Text style={styles.totalCurrency}>CAD</Text>
          </View>
        </View>
      </View>
    </>
  );
}

function SummaryRow({
  label,
  value,
  showInfo = false,
}: {
  label: string;
  value: number;
  showInfo?: boolean;
}) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.summaryRow}>
      <View style={styles.summaryLabelWithIcon}>
        <Text style={styles.summaryLabel}>{label}</Text>
        {showInfo ? (
          <MaterialCommunityIcons
            name="information-outline"
            size={14}
            color={theme.colors.text}
            style={styles.infoIcon}
          />
        ) : null}
      </View>
      <View style={styles.summaryValueContainer}>
        <Text style={styles.summarySymbol}>$</Text>
        <Text style={styles.summaryValue}>{value.toFixed(2)}</Text>
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

const styles = StyleSheet.create((theme) => ({
  tripCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: theme.spacing.md,
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
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.lg,
  },
  summaryTitle: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: theme.spacing.lg,
  },
  summaryRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },
  summaryLabelWithIcon: {
    alignItems: "center",
    flexDirection: "row",
  },
  summaryLabel: {
    color: theme.colors.text,
    fontSize: 14,
    opacity: 0.8,
  },
  infoIcon: {
    marginLeft: 6,
    opacity: 0.6,
  },
  summaryValueContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  summarySymbol: {
    color: theme.colors.text,
    fontSize: 14,
    marginRight: 6,
    opacity: 0.8,
  },
  summaryValue: {
    color: theme.colors.text,
    fontSize: 14,
    minWidth: 45,
    textAlign: "right",
  },
  divider: {
    backgroundColor: theme.colors.border,
    height: 1,
    marginVertical: theme.spacing.md,
  },
  totalRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.sm,
  },
  totalLabel: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  totalValueContainer: {
    alignItems: "baseline",
    flexDirection: "row",
  },
  totalSymbol: {
    color: theme.colors.primary,
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 4,
  },
  totalValue: {
    color: theme.colors.primary,
    fontSize: 20,
    fontWeight: "bold",
  },
  totalCurrency: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
}));
