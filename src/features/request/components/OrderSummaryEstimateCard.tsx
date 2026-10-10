import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import {
  PRICING_RATES,
  type PricingEstimate,
} from "../../../shared/utils/pricing";

interface OrderSummaryEstimateCardProps {
  estimate: PricingEstimate;
  itemCount: number;
}

export function OrderSummaryEstimateCard({
  estimate,
  itemCount,
}: OrderSummaryEstimateCardProps) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>Estimated Summary</Text>
      <SummaryRow
        label={`Items Subtotal (${itemCount} items)`}
        value={estimate.subtotal}
      />
      <SummaryRow
        label={`Service Fee (${formatRate(PRICING_RATES.SERVICE_FEE_RATE)}%)`}
        value={estimate.serviceFee}
        showInfo
      />
      <SummaryRow
        label={`Estimated Taxes (${formatRate(PRICING_RATES.TAX_RATE)}%)`}
        value={estimate.taxes}
        showInfo
      />
      <SummaryRow
        label={`Payment Processing (${formatRate(
          PRICING_RATES.PAYMENT_PROCESSING_RATE,
        )}% + $${PRICING_RATES.PAYMENT_PROCESSING_FIXED.toFixed(2)})`}
        value={itemCount > 0 ? estimate.paymentProcessing : 0}
        showInfo
      />
      <View style={styles.divider} />
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Estimated Total</Text>
        <View style={styles.summaryValueContainer}>
          <Text style={styles.totalSymbol}>$</Text>
          <Text style={styles.totalValue}>{estimate.total.toFixed(2)}</Text>
        </View>
      </View>
      <View style={styles.disclaimerBanner}>
        <MaterialCommunityIcons
          name="information-outline"
          size={20}
          color={theme.colors.primary}
          style={styles.disclaimerIcon}
        />
        <Text style={styles.disclaimerText}>
          Final total may vary based on actual store prices, taxes, and any
          substitutions.
        </Text>
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

function formatRate(rate: number) {
  return parseFloat((rate * 100).toFixed(2));
}

const styles = StyleSheet.create((theme) => ({
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    padding: theme.spacing.lg,
  },
  summaryTitle: {
    color: theme.colors.primary,
    fontSize: 20,
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
    marginBottom: theme.spacing.lg,
  },
  totalLabel: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  totalSymbol: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 4,
  },
  totalValue: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
  disclaimerBanner: {
    alignItems: "flex-start",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.sm,
    flexDirection: "row",
    padding: theme.spacing.md,
  },
  disclaimerIcon: {
    marginRight: theme.spacing.sm,
  },
  disclaimerText: {
    color: theme.colors.primary,
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
}));
