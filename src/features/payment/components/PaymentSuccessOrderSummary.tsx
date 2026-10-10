import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface PaymentSuccessOrderSummaryProps {
  storeName: string;
  storeLogoText: string;
  storeLogoSubText: string;
  routeText: string;
  neededBy?: string;
  latestDeliveryTime?: string;
  itemCount: number;
  subtotal: number;
  serviceFee: number;
  taxes: number;
  total: number;
}

export function PaymentSuccessOrderSummary({
  storeName,
  storeLogoText,
  storeLogoSubText,
  routeText,
  neededBy,
  latestDeliveryTime,
  itemCount,
  subtotal,
  serviceFee,
  taxes,
  total,
}: PaymentSuccessOrderSummaryProps) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.summaryCard}>
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

      <View style={styles.summaryDivider} />
      <SummaryRow
        label={`Items Subtotal (${itemCount} items)`}
        value={subtotal}
      />
      <SummaryRow label="Service Fee (15%)" value={serviceFee} showInfo />
      <SummaryRow label="Estimated Taxes (5%)" value={taxes} showInfo />
      <View style={styles.summaryDivider} />
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total Paid</Text>
        <View style={styles.totalValueContainer}>
          <Text style={styles.totalSymbol}>$</Text>
          <Text style={styles.totalValue}>{total.toFixed(2)}</Text>
          <Text style={styles.totalCurrency}>CAD</Text>
        </View>
      </View>
    </View>
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

function formatTime(isoString?: string) {
  if (!isoString) return "";
  return new Date(isoString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

const styles = StyleSheet.create((theme) => ({
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
  },
  tripCard: {
    flexDirection: "row",
    marginBottom: theme.spacing.md,
  },
  storeLogoContainer: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    height: 60,
    justifyContent: "center",
    marginRight: theme.spacing.md,
    width: 60,
  },
  storeLogoText: {
    color: theme.colors.surface,
    fontSize: 12,
    fontStyle: "italic",
    fontWeight: "900",
  },
  storeLogoSubText: {
    color: theme.colors.surface,
    fontSize: 7,
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
  summaryDivider: {
    backgroundColor: theme.colors.border,
    height: 1,
    marginVertical: theme.spacing.md,
  },
  summaryRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm,
  },
  summaryLabelWithIcon: {
    alignItems: "center",
    flexDirection: "row",
  },
  summaryLabel: {
    color: theme.colors.text,
    fontSize: 13,
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
    fontSize: 13,
    marginRight: 6,
    opacity: 0.8,
  },
  summaryValue: {
    color: theme.colors.text,
    fontSize: 13,
    minWidth: 45,
    textAlign: "right",
  },
  totalRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.xs,
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
